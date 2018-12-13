import { NgModule, } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';

import { CookieLawComponent } from './cookie-law/cookie-law.component';
import { ClientComponent } from './client.component';
import { DialogModule } from 'primeng/dialog';
import { ClientRoutingModule } from './client-routing.module';
import { Auth2Module } from '../authentication/auth.module';
import { ClientContainerComponent } from './client-container/client-container.component';

@NgModule({
  declarations: [
    ClientComponent,
    CookieLawComponent,
    ClientContainerComponent,
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    Auth2Module,
    BrowserModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ClientComponent
  ]
})
export class ClientModule {
 }
