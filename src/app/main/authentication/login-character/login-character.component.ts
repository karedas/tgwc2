import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoginClientService } from '../../client/services/login-client.service';
import { Router } from '@angular/router';
import { tgAnimations } from 'src/app/animations';
import { SocketService } from 'src/app/core/services/socket.service';
import { takeUntil, delay } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics-service.service';
import { NotAuthorizeError } from 'src/app/shared/errors/not-authorize.error';
import { UsernameValidation, PasswordValidation } from '../../common/validators/character-validations';

@Component({
  selector: 'tg-login-character',
  templateUrl: './login-character.component.html',
  styleUrls: ['../auth.component.scss'],
  animations: [tgAnimations],
  encapsulation: ViewEncapsulation.None
})
export class LoginCharacterComponent implements OnInit {

  public frmCharacterLogin: FormGroup;
  public loginFailed: boolean;
  public loginFailedError: string;
  public loginReplayMessage: string;
  public serverStatusMessage: boolean;

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
      'name': ['', UsernameValidation],
      'secret': ['', PasswordValidation]
    });

    this._unsubscribeAll = new Subject();

  }


  ngOnInit() {
    // Replay Game Server login response
    this.loginClientService.replayMessage
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((msg: string) => {
        if (msg !== undefined) {
          this.loginReplayMessage = msg;
        }
      });

    // Show Socket Error to notice user about Server Errors
    this.socketService.socket_error$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((serverstatus: boolean) => {
        this.serverStatusMessage = !serverstatus;
      });
  }

  get name() {
    return this.frmCharacterLogin.get('name');
  }

  get secret() {
    return this.frmCharacterLogin.get('secret');
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
          this.googleService.emitEvent(`userPage`, `User ${this.name.value} Logged In`, 'login');

          this.router.navigate([redirect]).then(() => {
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
