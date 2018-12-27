import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsernameValidation, PasswordValidation } from '../../common/validations';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/authentication/services/login.service';
import { Subscription } from 'rxjs';
import { NotAuthorizeError } from 'src/app/shared/errors/not-authorize.error';

import gitInfo from '../../../git-version.json';

@Component({
  selector: 'tg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit, OnDestroy {

  gitVersion = gitInfo.raw;
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

  public login() {
    if(this.loginForm.invalid) {
      return;
    }
    
    const values = this.loginForm.value;

    this.loginSubscription = this.loginService.login(values)
      .subscribe((loginSuccess: boolean) => {
        if(loginSuccess === true) { 
          // Get the redirect URL from our auth service
          // If no redirect has been set, use the default
          let redirect = this.loginService.redirectUrl ? this.loginService.redirectUrl : '/webclient'
          // Redirect the user
          this.router.navigate([redirect]);
        } else {
          this.loginFailed = true;
        }
    }, (error) => {
        console.log(error);
        if (error instanceof NotAuthorizeError) {
          this.loginFailed = false;
        }
    });
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }
}

