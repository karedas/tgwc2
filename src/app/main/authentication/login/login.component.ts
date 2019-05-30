import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.dev';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { NotAuthorizeError } from 'src/app/shared/errors/not-authorize.error';

@Component({
  selector: 'tg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public frmLogin: FormGroup;
  public loginFailed: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
    ) {
    this.frmLogin = this.createLoginForm();
  }
  
  ngOnInit() {}

  get f() { return this.frmLogin.controls; }

  private createLoginForm(): FormGroup {

    return this.fb.group({
      email: ['lisandr84@gmail.com', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      password: ['morfeo.84', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        ])
      ],
    });
    
  }

  onSubmit() {
    
    let email = this.f.email.value;
    let password = this.f.password.value;

    if( !this.frmLogin.invalid ) {
      this.loginService.login({email, password})
      .subscribe((loginSuccess: boolean) => {
        if (loginSuccess === true) {
          this.router.navigate(['/manager']);
        } else {
          this.loginFailed = true;
        }
      }, (error) => {
        if (error instanceof NotAuthorizeError) {
          this.loginFailed = true;
        }
      });
    }  
  }

}
