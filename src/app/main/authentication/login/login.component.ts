import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/main/authentication/services/login.service';
import { Subscription, Subject } from 'rxjs';
import { NotAuthorizeError } from 'src/app/shared/errors/not-authorize.error';

import { UsernameValidation, PasswordValidation } from 'src/app/main/common/validations.js';
import { takeUntil } from 'rxjs/operators';

import gitInfo from 'src/git-version.json';
import { SocketService } from 'src/app/services/socket.service';
import { GameService } from 'src/app/main/client/services/game.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics-service.service';

@Component({
  selector: 'tg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit, OnDestroy {

  gitVersion = gitInfo.tag;
  serverStat: any;

  loginForm: FormGroup;
  loginFormErrors: any;
  loginFailed: boolean; 1;
  loginSubscription: Subscription;

  loginReplayMessage: string;
  serverStatusMessage: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private game: GameService,
    private socketService: SocketService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    this.loginFormErrors = {
      username: {},
      password: {}
    };

    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {

    this.resetLoginState();

    this.loginForm = this.formBuilder.group({
      'username': ['', UsernameValidation],
      'password': ['', PasswordValidation]
    });

    this.loginService._loginReplayMessage
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((msg: string) => {
        if (msg !== undefined) {
          this.loginReplayMessage = msg;
        }
      });

    // Server Stats like player online from serverstat file
    this.game.serverStat
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (stat: string) => { this.serverStat = stat; }
      );


    // Show Socket Error to notice user about Server Errors
    this.socketService.socket_error$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((serverstatus: boolean) => {
        this.serverStatusMessage = !serverstatus;
      });
  }

  resetLoginState() {
    this.loginService.logout();
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  public login() {

    // Wait validation on inputs value and socket connection
    if (this.loginForm.invalid && !this.socketService.isConnected) {
      return;
    }

    const values = this.loginForm.value;

    this.loginSubscription = this.loginService.login(values)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((loginSuccess: boolean) => {

        if (loginSuccess === true) {

          this.loginService._loginReplayMessage = ' ';
          const redirect = this.loginService.redirectUrl ? this.loginService.redirectUrl : '/webclient';
          
          // Google Analytics
          this.googleAnalyticsService.emitEvent(`userPage`, `User ${this.username.value} Action`, 'login');
          this.router.navigate([redirect]);

        } else {
          this.loginFailed = true;
        }
      }, (error) => {
        if (error instanceof NotAuthorizeError) {
          this.loginFailed = false;
        }
      });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

