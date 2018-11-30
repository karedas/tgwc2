import { NgModule, } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { CookieLawComponent } from './cookie-law/cookie-law.component';
import { LoginComponent } from './login/login.component';
import { ClientComponent } from './client.component';

import {DialogModule} from 'primeng/dialog';


@NgModule({
  declarations: [
    ClientComponent,
    LoginComponent,
    CookieLawComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ClientComponent
  ]
})
export class ClientModule { }
