import { NgModule } from '@angular/core';
import { ModalComponent } from './modal.component';
import { jqxWindowComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ModalComponent,
    // jqxWindowComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    // jqxWindowComponent,
    ModalComponent
  ]
})
export class ModalModule { }
