import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth2Module } from '../authentication/auth.module';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import {ToastModule} from 'primeng/toast';


@NgModule({
  declarations: [
  ],
  imports: [
    DialogModule,
    Auth2Module,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    Auth2Module,
    DialogModule
  ]
})
export class SharedModule {
  static forRoot() {
    return {
        ngModule: SharedModule,
    };
  }
 }
