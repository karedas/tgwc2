import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';

// import social buttons module
import { SignupComponent } from './signup/signup.component';
import { VerifyRegistrationComponent } from './verify-registration/verify-registration.component';
import { SignupConfirmComponent } from './signup-confirm/signup-confirm.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
// import { LoginClientComponent } from './login-client/login.component';
import { QuotesComponent } from './login-client/quotes/quotes.component';

@NgModule({
  declarations: [
    SignupComponent,
    VerifyRegistrationComponent,
    SignupConfirmComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,


    // REMOVE
    // LoginClientComponent,
    QuotesComponent
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    FlexLayoutModule,
  ],
  exports: [
  ]
})
export class Auth2Module { }
