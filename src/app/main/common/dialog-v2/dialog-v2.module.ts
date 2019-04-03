import { NgModule } from '@angular/core';
import { CookieLawComponent } from '../../client/windows/cookie-law/cookie-law.component';
import { MatDialogModule } from '@angular/material';
import { NewsComponent } from '../../client/windows/news/news.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginSmartComponent } from '../../client/windows/login-smart/login-smart.component';
import { EditorComponent } from '../../client/windows/editor/editor.component';

@NgModule({
  declarations: [
    CookieLawComponent,
    NewsComponent,
    LoginSmartComponent,
    EditorComponent
  ],
  imports: [
    SharedModule,
    MatDialogModule,
  ],
  entryComponents: [
    CookieLawComponent,
    NewsComponent,
    LoginSmartComponent,
    EditorComponent
  ]
})
export class DialogV2Module { }
