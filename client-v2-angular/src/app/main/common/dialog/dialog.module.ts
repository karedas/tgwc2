import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { InsertionDirective } from './insertion.directive';
import { jqxWindowComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';

@NgModule({
  declarations: [
    DialogComponent, 
    jqxWindowComponent,
    InsertionDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DialogComponent,
    jqxWindowComponent
  ],
  entryComponents: [DialogComponent]
})
export class DialogModule { }
