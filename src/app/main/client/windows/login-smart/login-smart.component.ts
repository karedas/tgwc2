import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ClientState } from 'src/app/store/state/client.state';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/main/authentication/services/login.service';

import { FormBuilder, FormGroup } from '@angular/forms';
import { UsernameValidation, PasswordValidation } from 'src/app/main/common/validations';
import { takeUntil } from 'rxjs/operators';
import { NotAuthorizeError } from 'src/app/shared/errors/not-authorize.error';
import { ResetAction } from 'src/app/store/actions/client.action';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'tg-login-smart',
  templateUrl: './login-smart.component.html',
  styleUrls: ['./login-smart.component.scss']
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
    private loginService: LoginService) {

    this.loginFormErrors = {
      username: {},
      password: {}
    };

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this.smartLoginForm = this.formBuilder.group({
      'username': ['', UsernameValidation],
      'password': ['', PasswordValidation]
    });

    this.loginService._loginReplayMessage
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((err: string) => {
        if (err !== undefined) {
          this.loginReplayMessage = err;
        }
      });
  }

  get username() {
    return this.smartLoginForm.get('username');
  }

  get password() {
    return this.smartLoginForm.get('password');
  }

  public login() {
    if (this.smartLoginForm.invalid) {
      return;
    }


    const values = this.smartLoginForm.value;

    this.loginSubscription = this.loginService.login(values)
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
    this.loginService.reconnect();
    // TODO: Wait OK from Server
    this.dialogRef.close();
  }

  toggle(event?: Event) {

    if (event) {
      event.preventDefault();
    }

    this.showForm = !this.showForm;
  }

  navigateToHome() {
    this.dialogRef.close();
    this.router.navigate(['login']).then(() => {
      this.store.dispatch(new ResetAction);
    });
  }


  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
