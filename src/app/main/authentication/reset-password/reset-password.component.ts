import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tgAnimations } from 'src/app/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../common/validators/custom-validators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'tg-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../auth.component.scss'],
  animations: [tgAnimations]

})
export class ResetPasswordComponent implements OnInit {

  public submitted = false;
  public frmNewPassword: FormGroup;
  public loginFailedError: string;
  public success = false;
  token: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.frmNewPassword = this.fb.group({
      password: [null, Validators.compose([
        Validators.minLength(5),
        Validators.required,
      ])],
      confirmPassword: [null, Validators.compose([Validators.required])],
    }, {
        validator: [CustomValidators.passwordMatchValidator]
      });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
        this.token = params['token'];
    });
  }

  get f() { return this.frmNewPassword.controls; }


  onSubmit() {
    this.submitted = true;
    const password = this.f.password.value;
    this.loginFailedError = '';

    if (!this.frmNewPassword.invalid) {
      const url = environment.apiAddress + '/auth/updatepwd';

      this.http.post(url, { resetPasswordToken: this.token, password: password })
        .pipe(
          map((apiResponse: ApiResponse)  => {
            if (apiResponse.success) {
              this.success = true;
            }
          }),
          catchError( err => {
            this.loginFailedError = err.error.status;
            return throwError(err);
          })
        ).subscribe();
    }

  }
}
