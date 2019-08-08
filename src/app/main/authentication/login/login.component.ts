import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { NotAuthorizeError } from 'src/app/shared/errors/not-authorize.error';
import { AppError } from 'src/app/shared/errors/app.error';
import { tgAnimations } from 'src/app/animations';
import { ApiResponse } from 'src/app/core/models/api-response.model';

@Component({
  selector: 'tg-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss'],
  animations: [tgAnimations]
})
export class LoginComponent {

  public frmLogin: FormGroup;
  public loginFailed: boolean;
  public loginFailedError: string;

  public onProcess = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.frmLogin = this.createLoginForm();
  }

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

    this.loginFailedError = '';

    if (!this.frmLogin.invalid) {

      this.onProcess = true;

      const loginAuth = {
          username: <string>this.f.username.value,
          password: <string>this.f.password.value
      };

      this.loginService.login(loginAuth)
        .subscribe((res: ApiResponse) => {
          if (res.success === true) {
            this.router.navigate(['/manager']);
          } else {
            this.loginFailed = true;
            this.loginFailedError = res.status;
            this.onProcess = false;
          }
        }, (error: HttpErrorResponse) => {

          this.loginFailed = true;
          this.onProcess = false;

          if (error instanceof NotAuthorizeError) {
            this.loginFailedError = error.originalError.error.status;
          } else if (error instanceof AppError) {
            this.loginFailedError = error.originalError.error.status;
          }
        });
    } else {
      // Empty or unvalid User/password
      this.loginFailedError = 'Username o Password incorretta';

    }
  }

}
