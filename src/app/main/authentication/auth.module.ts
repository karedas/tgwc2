import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';

// import social buttons module
import { MainNavigationModule } from '../main-navigation/main-navigation.module';
import { SignupComponent } from './signup/signup.component';
import { VerifyRegistrationComponent } from './verify-registration/verify-registration.component';
import { SignupConfirmComponent } from './signup-confirm/signup-confirm.component';
// import { LoginClientComponent } from './login-client/login.component';
import { QuotesComponent } from './login-client/quotes/quotes.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    // LoginClientComponent,
    SignupComponent,
    VerifyRegistrationComponent,
    SignupConfirmComponent,
    LoginComponent,
    ForgotPasswordComponent,
    // QuotesComponent,
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    FlexLayoutModule,
  ],
  exports: [
    // MainNavigationModule,
    // AuthRoutingModule
  ]
})
export class Auth2Module { }
