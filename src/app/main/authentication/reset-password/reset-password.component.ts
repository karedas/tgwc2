import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tgAnimations } from 'src/app/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../common/validators/custom-validators';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'tg-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../auth.component.scss'],
  animations: [ tgAnimations ]

})
export class ResetPasswordComponent implements OnInit {

  private paramToken: any;
  public submitted: boolean = false;
  public frmNewPassword: FormGroup;
  public loginFailedError: string;
  token: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.frmNewPassword = this.fb.group({
      password: [null, Validators.compose([
        Validators.minLength(5),
        Validators.required,
      ])],
      confirmPassword: [null, Validators.compose([Validators.required])],
    },     {
      validator: [CustomValidators.passwordMatchValidator]
    });
   }

  ngOnInit() {
    this.paramToken = this.route.params.subscribe(params => {
      this.token =  params['token']; 
   });
  }

  get f() { return this.frmNewPassword.controls; }


  onSubmit() {
    this.submitted = true;
    let password = this.f.password.value;
    this.loginFailedError = '';

    if (!this.frmNewPassword.invalid) {

      // const url = environment.apiAddress + '/auth/reset/' + code;

      // return this.http.get(url)
      //   .pipe(
      //     map((apiResponse: ApiResponse) => {
      //       this.username = apiResponse.data.username
      //       this.success = apiResponse.success;
      //     }),
      //     catchError(err => {
      //       this.loginFailedError = err.error.status;
      //       return Observable.throw(err);
      //     })
      //   )

    }
      
  }
}
