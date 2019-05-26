import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'tg-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    repeatPassword: new FormControl(''),
    email: new FormControl(''),
    repeatEmail: new FormControl(''),
  });

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onSubmit() {
    let httpBody = {
      username: this.signupForm.get('username').value,
      password: this.signupForm.get('password').value,
      email: this.signupForm.get('email').value
    }
    console.log(this.signupForm.value);

    this.http.post('http://localhost:9595/auth/registration', httpBody)
      .pipe(
        catchError((error: any) => this.handleError(error))
      )
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
