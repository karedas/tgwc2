import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CustomValidators } from '../../common/validators/custom-validators';

@Component({
  selector: 'tg-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public signupForm: FormGroup;
  public submitted: boolean = false;
  public formOk: boolean = false;
  public apiError: string;

  constructor(private http: HttpClient, private fb: FormBuilder) { }

  ngOnInit() {
    this.signupForm = this.createSignupForm();
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  createSignupForm(): FormGroup {
    // return this.fb.group(
    //   {
    //     username: [null, Validators.compose([
    //       Validators.required,
    //       Validators.minLength(5),
    //     ])],
    //     // email is required and must be a valid email email
    //     email: [null, Validators.compose([
    //       Validators.email,
    //       Validators.required])
    //     ],
    //     confirmEmail: [null, Validators.compose([Validators.required])],
    //     password: [null, Validators.compose([
    //       Validators.minLength(5),
    //       Validators.required,
    //       // CustomValidators.patternValidator(/\d/, { hasNumber: true }),
    //       // CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
    //       // CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true })
    //       ])
    //     ],
    //     confirmPassword: [null, Validators.compose([Validators.required])]
    //   },
    //   {
    //     // check whether our password and confirm password match
    //     validator: [CustomValidators.passwordMatchValidator, CustomValidators.emailMatchValidator]
    //   });
    return this.fb.group(
      {
        username: ['andrea', Validators.compose([
          Validators.required,
          Validators.minLength(5),
        ])],
        // email is required and must be a valid email email
        email: ['lisandr84@gmail.com', Validators.compose([
          Validators.email,
          Validators.required])
        ],
        confirmEmail: ['lisandr84@gmail.com', Validators.compose([Validators.required])],
        password: ['testest', Validators.compose([
          Validators.minLength(5),
          Validators.required,
          // CustomValidators.patternValidator(/\d/, { hasNumber: true }),
          // CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
          // CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true })
          ])
        ],
        confirmPassword: ['testest', Validators.compose([Validators.required])]
      },
      {
        // check whether our password and confirm password match
        validator: [CustomValidators.passwordMatchValidator, CustomValidators.emailMatchValidator]
      });
  }

  onSubmit() {
    this.submitted = true;

    console.log(this.signupForm.invalid);
    if (this.signupForm.invalid) {
      return;
    }

    let httpBody = {
      username: this.signupForm.get('username').value,
      password: this.signupForm.get('password').value,
      email: this.signupForm.get('email').value
    }

    this.http.post('http://localhost:9595/auth/registration', httpBody)
      .subscribe(() => {
        this.formOk = true;
      }, (error) => {
        this.apiError = error;
      })
  }
}
