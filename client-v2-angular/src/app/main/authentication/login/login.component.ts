import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/main/authentication/services/login.service';
import { Subscription, Subject } from 'rxjs';
import { NotAuthorizeError } from 'src/app/shared/errors/not-authorize.error';

import { UsernameValidation, PasswordValidation } from 'src/app/main/common/validations.js';
import { takeUntil } from 'rxjs/operators';

import gitInfo from 'src/git-version.json';
import { SocketService } from 'src/app/services/socket.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit, OnDestroy {

  gitVersion = gitInfo.hash;
  serverStat: any ;

  loginForm: FormGroup;
  loginFormErrors: any;
  loginFailed: boolean;1
  loginSubscription: Subscription;


  // Private
  private _unsubscribeAll: Subject<any>;

  socketloginReplayMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private game: GameService,
    private socketService: SocketService,
    @Inject(PLATFORM_ID) private platformId: any
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

    this.loginService.loginReplayMessage
      .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((err: string) => {
          if (err !== undefined) {
            this.socketloginReplayMessage = err;
          }
        });

    this.game.serverStat.subscribe(
      (stat: string) => { this.serverStat = stat}
    ) 
    
  }

  resetLoginState() {
    this.socketService.destroy();
    this.loginService.logout();
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  public login() {
    if (this.loginForm.invalid) {
      return;
    }

    const values = this.loginForm.value;

    this.loginSubscription = this.loginService.login(values)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((loginSuccess: boolean) => {
        if (loginSuccess === true) {

          const redirect = this.loginService.redirectUrl ? this.loginService.redirectUrl : '/webclient';
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

