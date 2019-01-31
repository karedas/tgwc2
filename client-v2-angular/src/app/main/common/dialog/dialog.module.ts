import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CookieLawComponent } from '../../client/windows/cookie-law/cookie-law.component';
import { WelcomeNewsComponent } from '../../client/windows/welcome-news/welcome-news.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    NgScrollbarModule,
    NgxDatatableModule,

  ],
  exports: [
    NgScrollbarModule,
    NgxDatatableModule
  ],
  entryComponents: [CookieLawComponent, WelcomeNewsComponent]
})
export class DialogModule { }
