import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CustomValidators } from '../../common/validators/custom-validators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { NotAuthorizeError } from 'src/app/shared/errors/not-authorize.error';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { tgAnimations } from 'src/app/animations';

@Component({
  selector: 'tg-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations: [tgAnimations]

})
export class SignupComponent implements OnInit {

  public signupForm: FormGroup;
  public submitted = false;
  public apiError: string;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.signupForm = this.createSignupForm();
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  createSignupForm(): FormGroup {
    return this.fb.group(
      {
        username: [null, Validators.compose([
          Validators.required,
          Validators.minLength(5),
        ])],
        email: [null, Validators.compose([
          Validators.email,
          Validators.required])
        ],
        confirmEmail: [null, Validators.compose([Validators.required])],
        password: [null, Validators.compose([
          Validators.minLength(5),
          Validators.required,
        ])
        ],
        confirmPassword: [null, Validators.compose([Validators.required])],
        conditions: new FormControl('', [(control) => {
          return !control.value ? { 'required': true } : null;
        }]
        )
      },
      {
        validator: [CustomValidators.passwordMatchValidator, CustomValidators.emailMatchValidator]
      });
  }

  onSubmit() {
    this.submitted = true;

    if (this.signupForm.invalid) {
      return;
    }

    const url = environment.apiAddress + '/auth/registration';

    const httpBody = {
      username: this.signupForm.get('username').value,
      password: this.signupForm.get('password').value,
      email: this.signupForm.get('email').value
    };

    this.http.post(url, httpBody)
      .subscribe((apiResponse: ApiResponse) => {
        if (apiResponse.httpCode !== 200) {
          this.apiError = apiResponse.data;
        } else {
          this.apiError = '';
          this.router.navigate(['/auth/signup-confirm']);
        }
      }, (error) => {
        if (error instanceof NotAuthorizeError) {
        }
      });
  }
}
