import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoginClientService } from '../../client/services/login-client.service';
import { Router } from '@angular/router';
import { tgAnimations } from 'src/app/animations';
import { UsernameValidation, PasswordValidation } from '../../common/validators/character-validations';
import { SocketService } from 'src/app/core/services/socket.service';
import { takeUntil, delay } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics-service.service';
import { NotAuthorizeError } from 'src/app/shared/errors/not-authorize.error';

@Component({
  selector: 'tg-login-character',
  templateUrl: './login-character.component.html',
  styleUrls: ['../auth.component.scss'],
  animations: [ tgAnimations ]
})
export class LoginCharacterComponent {

  public frmCharacterLogin: FormGroup;
  public loginFailed: boolean;
  public loginFailedError: string;
  
  // Private
  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private fb: FormBuilder,
    private loginClientService: LoginClientService,
    private socketService: SocketService,
    private router: Router,
    private googleService: GoogleAnalyticsService
  ) { 
    this.frmCharacterLogin = this.fb.group({
      'username': ['', UsernameValidation],
      'password': ['', PasswordValidation]
    });

    this._unsubscribeAll = new Subject();

  }

  get username() {
    return this.frmCharacterLogin.get('username');
  }

  get password() {
    return this.frmCharacterLogin.get('password');
  }

  public login() {

        // Wait validation on inputs value and socket connection
        if (this.frmCharacterLogin.invalid && !this.socketService.isConnected) {
          return;
        }

        const values = this.frmCharacterLogin.value;
        this.loginClientService.login(values)
          .pipe(
            delay(1000),
            takeUntil(this._unsubscribeAll)
            )
            .subscribe((loginSuccess: boolean) => {

              if (loginSuccess === true) {
                const redirect = this.loginClientService.redirectUrl ? this.loginClientService.redirectUrl : '/webclient';
      
                // Google Analytics
                this.googleService.emitEvent(`userPage`, `User ${this.username.value} Logged In`, 'login');
      
                this.router.navigate([redirect]).then( () => {
                  this.loginClientService.replayMessage = ' ';
                });
      
              } else {
                this.loginFailed = true;
              }
            }, (error) => {
              if (error instanceof NotAuthorizeError) {
                this.loginFailed = false;
              }
            });
  }

}
