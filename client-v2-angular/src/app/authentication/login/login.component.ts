import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsernameValidation, PasswordValidation } from '../../common/validations';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { GameState } from 'src/app/store/state/game.state';

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
    private store: Store<GameState>,
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
    // const keys = Object.keys(values);

    
    this.loginService.login(values);
    this.store.select<any>('gameState').subscribe(state => {
      if(state.isAuthenticated) {
        console.log('YO');
        this.router.navigate(['/game']);
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
