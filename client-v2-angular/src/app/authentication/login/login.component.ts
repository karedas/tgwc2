import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsernameValidation, PasswordValidation } from '../../common/validations';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { GameState } from 'src/app/store/state/game.state';
import { AuthGuard } from '../auth.guard';
import { compileFactoryFunction } from '@angular/compiler/src/render3/r3_factory';

@Component({
  selector: 'tg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  loginFormErrors: any;
  loginFailed: boolean;
  loginSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.loginFormErrors = {
      username: {},
      password: {}
    }
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      'username': ['', UsernameValidation],
      'password': ['', PasswordValidation]
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {

    const values = this.loginForm.value;

    this.loginSubscription = this.loginService.login(values).subscribe(() => {
      if(this.loginService.isLoggedIn$) { 
        // Get the redirect URL from our auth service
        // If no redirect has been set, use the default
        let redirect = this.loginService.redirectUrl ? this.loginService.redirectUrl : '/webclient'

        // Redirect the user
        this.router.navigate([redirect]);
      }
    });
  }

  private pushErrorfor(ctrl_name: string, msg: string) {
    this.loginForm.controls[ctrl_name].setErrors({ 'msg': msg });
  }


  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }
}

