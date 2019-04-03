import { NgModule } from '@angular/core';
import { CookieLawComponent } from '../../client/windows/cookie-law/cookie-law.component';
import { MatDialogModule } from '@angular/material';
import { NewsComponent } from '../../client/windows/news/news.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    CookieLawComponent,
    NewsComponent
  ],
  imports: [
    SharedModule,
    MatDialogModule,
  ],
  entryComponents: [
    CookieLawComponent,
    NewsComponent
  ]
})
export class DialogV2Module { }
