import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { QuotesComponent } from './login/quotes/quotes.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';

// import social buttons module
import { JwSocialButtonsModule } from 'jw-angular-social-buttons';
import { MainNavigationModule } from '../main-navigation/main-navigation.module';
import { SignupComponent } from './signup/signup.component';
import { VerifyRegistrationComponent } from './verify-registration/verify-registration.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    QuotesComponent,
    VerifyRegistrationComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    FlexLayoutModule,
    JwSocialButtonsModule,
    MainNavigationModule
  ],
  exports: [
    MainNavigationModule,
    AuthRoutingModule
  ]
})
export class Auth2Module { }
