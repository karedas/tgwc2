import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { tgAnimations } from 'src/app/animations';
import { LoginService } from '../services/login.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'tg-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [ tgAnimations ]
})
export class ForgotPasswordComponent implements OnInit {
  
  public forgotPasswordForm: FormGroup;
  public resetPasswordError: string;
  public sended: boolean = false;

  constructor( 
    private loginService: LoginService,
    private fb: FormBuilder,
    private http: HttpClient
    ) { 
    }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
        email: ['lisanasdasddr84@gmail.com', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {

    let email = this.forgotPasswordForm.controls.email.value;

    this.resetPasswordError = '';

    if(!this.forgotPasswordForm.invalid) {
      this.http.post(environment.apiAddress + '/auth/reset', {"email": email})
        .subscribe((response: ApiResponse) => {
          if(response.success) {
            this.sended = true;
          }
          else {
            this.sended = false;
            this.resetPasswordError = response.status;
          }
        });
    }
  }
}
