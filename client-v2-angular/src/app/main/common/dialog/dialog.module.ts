import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { InsertionDirective } from './insertion.directive';
import { jqxWindowComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import { NgScrollbarModule } from 'ngx-scrollbar';

@NgModule({
  declarations: [
    DialogComponent,
    jqxWindowComponent,
    InsertionDirective,
  ],
  imports: [
    CommonModule,
    NgScrollbarModule,

  ],
  exports: [
    DialogComponent,
    jqxWindowComponent,
    NgScrollbarModule,
  ],
  entryComponents: [DialogComponent]
})
export class DialogModule { }
