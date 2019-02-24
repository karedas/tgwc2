import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericDialogcomponent } from './dialog.component';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    GenericDialogcomponent
  ],
  imports: [
    CommonModule,
    DialogModule,
  ],
  exports: [
    GenericDialogcomponent,
  ],

})
export class DialogGenericModule { }
