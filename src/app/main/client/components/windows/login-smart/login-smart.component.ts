import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ClientState } from 'src/app/main/client/store/state/client.state';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup } from '@angular/forms';
import { UsernameValidation, PasswordValidation } from 'src/app/main/common/validators/character-validations';
import { takeUntil } from 'rxjs/operators';
import { NotAuthorizeError } from 'src/app/shared/errors/not-authorize.error';
import { MatDialogRef } from '@angular/material/dialog';
import * as ClientActions from '../../../store/actions/client.action';
import { LogService } from '../../../services/log.service';
import { LoginClientService } from 'src/app/main/authentication/services/login-client.service';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'tg-login-smart',
  templateUrl: './login-smart.component.html',
  styleUrls: ['./login-smart.component.scss'],
})
export class LoginSmartComponent implements OnInit, OnDestroy {

  public readonly dialogID: string = 'loginwidget';
  public inGameState$: Observable<boolean>;
  public showForm = false;

  smartLoginForm: FormGroup;
  loginFormErrors: any;
  loginFailed: boolean; 1;
  loginSubscription: Subscription;

  loginReplayMessage: string;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<ClientState>,
    private router: Router,
    private dialogRef: MatDialogRef<LoginSmartComponent>,
    private logService: LogService,
    private gameService: GameService,
    private loginClientService: LoginClientService) {

    this.loginFormErrors = {
      username: {},
      password: {}
    };

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this.smartLoginForm = this.formBuilder.group({
      username: ['', UsernameValidation],
      password: ['', PasswordValidation]
    });

    this.loginClientService.replayMessage
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((err: string) => {
        if (err !== undefined) {
          this.loginReplayMessage = err;
        }
      });
  }

  // get username() {
  //   return this.smartLoginForm.get('username');
  // }

  // get password() {
  //   return this.smartLoginForm.get('password');
  // }

  public login() {

    if (this.smartLoginForm.invalid) {
      return;
    }

    this.store.dispatch(ClientActions.resetAction());

    const values = this.smartLoginForm.value;

    this.loginSubscription = this.loginClientService.login(values)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((loginSuccess: boolean) => {
        if (loginSuccess === true) {
          this.dialogRef.close();
        } else {
          this.loginFailed = true;
        }
      }, (error) => {
        if (error instanceof NotAuthorizeError) {
          this.loginFailed = false;
        }
      });
  }


  onReconnect() {
    this.store.dispatch(ClientActions.resetAction());
    this.loginClientService.reconnect();
    this.dialogRef.close();
    this.gameService.processCommands('', false);
  }

  // toggle(event?: Event) {

  //   if (event) {
  //     event.preventDefault();
  //   }

  //   this.showForm = !this.showForm;
  // }

  navigateToHome() {
    this.dialogRef.close();
    this.router.navigate(['/']).then(() => {
      this.store.dispatch(ClientActions.resetAction());
      this.logService.resetLog();
    });
  }


  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
