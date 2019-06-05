import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.dev';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { NotAuthorizeError } from 'src/app/shared/errors/not-authorize.error';
import { AppError } from 'src/app/shared/errors/app.error';
import { tgAnimations } from 'src/app/animations';

@Component({
  selector: 'tg-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss'],
  animations: [tgAnimations]
})
export class LoginComponent implements OnInit {

  public frmLogin: FormGroup;
  public loginFailed: boolean;
  public loginFailedError: string;

  public onProcess: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.frmLogin = this.createLoginForm();
  }

  ngOnInit() { }

  get f() { return this.frmLogin.controls; }

  private createLoginForm(): FormGroup {

    return this.fb.group({
      username: [null, Validators.compose([
        Validators.required,
      ])],
      password: [null, Validators.compose([
        Validators.minLength(5),
        Validators.required,
      ])
      ],
    });

  }

  onSubmit() {

    let username = this.f.username.value;
    let password = this.f.password.value;

    this.loginFailedError = '';

    if (!this.frmLogin.invalid) {
      
      this.onProcess = true;

      this.loginService.login({ username, password })
        .subscribe((loginSuccess: boolean) => {


          if (loginSuccess === true) {
            this.router.navigate(['/manager']);
          } else {
            this.loginFailed = true;
          }
        }, (error) => {
          this.loginFailed = true;
          this.onProcess = false;
          if (error instanceof NotAuthorizeError) {
            console.log(error);
            this.loginFailedError = error.originalError.error.status;
          } 
          else if (error instanceof AppError) {
            this.loginFailedError = error.originalError.error.status;
          }
        });
    }
    else {
      this.loginFailedError = 'Username o Password incorretta';
    }
  }

}
