import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoginClientService } from 'src/app/main/authentication/services/login-client.service';
import { PasswordValidation, UsernameValidation } from 'src/app/main/common/validators/character-validations';
import { NotAuthorizeError } from 'src/app/shared/errors/not-authorize.error';
import { environment } from 'src/environments/environment';

import { GameService } from '../../../services/game.service';
import { LogService } from '../../../services/log.service';
import { TGState } from '../../../store';
import * as ClientActions from '../../../store/actions/client.action';
import { getHero } from '../../../store/selectors';


@Component({
  selector: 'tg-login-smart',
  templateUrl: './login-smart.component.html',
  styleUrls: ['./login-smart.component.scss']
})
export class LoginSmartComponent implements OnInit, OnDestroy {
  readonly imagepath: string = environment.media_address;
  readonly dialogID: string = 'loginwidget';

  loggedHero: any;
  inGameState$: Observable<boolean>;
  showForm = false;
  smartLoginForm: FormGroup;
  loginFormErrors: any;
  loginFailed: boolean;
  1;
  loginSubscription: Subscription;
  loginReplayMessage: string;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<TGState>,
    private router: Router,
    private dialogRef: MatDialogRef<LoginSmartComponent>,
    private logService: LogService,
    private gameService: GameService,
    private loginClientService: LoginClientService
  ) {
    this.loginFormErrors = {
      username: {},
      password: {}
    };

    this.store.pipe(select(getHero)).subscribe(hero => {
      this.loggedHero = {name: hero.name, image: hero.image};
    });

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

  public login() {
    if (this.smartLoginForm.invalid) {
      return;
    }

    this.store.dispatch(ClientActions.resetAction());
    const values = this.smartLoginForm.value;

    this.loginSubscription = this.loginClientService
      .login(values)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (loginSuccess: boolean) => {
          if (loginSuccess === true) {
            this.dialogRef.close();
          } else {
            this.loginFailed = true;
          }
        },
        error => {
          if (error instanceof NotAuthorizeError) {
            this.loginFailed = false;
          }
        }
      );
  }

  onReconnect() {
    this.dialogRef.close();
    this.store.dispatch(ClientActions.resetAction());
    this.loginClientService.reconnect();
    // TODO mouve out
    this.gameService.processCommands('', false);
  }

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
