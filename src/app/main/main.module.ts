import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainComponent } from './main.component';
import { CookieLawComponent } from './client/windows/cookie-law/cookie-law.component';
import { Auth2Module } from './authentication/auth.module';


@NgModule({
  declarations: [
    MainComponent,
    CookieLawComponent,
  ],
  imports: [
    SharedModule,
    Auth2Module,
  ],
  exports: [
    MainComponent,
  ],
  entryComponents: [
    CookieLawComponent
  ]
})
export class MainModule {}
