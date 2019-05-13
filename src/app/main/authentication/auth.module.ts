import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { QuotesComponent } from './login/quotes/quotes.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RegistrationModule } from '../registration/registration.module';

// import social buttons module
import { JwSocialButtonsModule } from 'jw-angular-social-buttons';

@NgModule({
  declarations: [
    LoginComponent,
    QuotesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    RegistrationModule,
    FlexLayoutModule,
    JwSocialButtonsModule
  ],
  exports: [
    AuthRoutingModule
  ]
})
export class Auth2Module { }
