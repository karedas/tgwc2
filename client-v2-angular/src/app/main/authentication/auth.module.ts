import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { QuotesComponent } from './login/quotes/quotes.component';
import { RegistrationComponent } from '../registration/registration.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    QuotesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
  ],
  exports: [
    RegistrationComponent
  ]
})
export class Auth2Module { }
