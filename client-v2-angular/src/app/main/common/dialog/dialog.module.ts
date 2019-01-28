import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { jqxWindowComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    DialogComponent,
    jqxWindowComponent,
  ],
  imports: [
    CommonModule,
    NgScrollbarModule,
    NgxDatatableModule,

  ],
  exports: [
    DialogComponent,
    jqxWindowComponent,
    NgScrollbarModule,
    NgxDatatableModule
  ],
  entryComponents: [DialogComponent]
})
export class DialogModule { }
