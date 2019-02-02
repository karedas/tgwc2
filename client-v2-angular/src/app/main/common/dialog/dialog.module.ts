import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogsComponent } from './dialog.component';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    DialogsComponent
  ],
  imports: [
    CommonModule,
    DialogModule
  ],
  exports: [
    DialogsComponent
  ],

})
export class DialogGenericModule { }
