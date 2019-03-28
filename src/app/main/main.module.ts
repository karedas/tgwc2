import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './authentication/services/login.guard';
import { CookieLawComponent } from './client/windows/cookie-law/cookie-law.component';
import { WindowsModule } from './client/windows/windows.module';

export const routes = [
  {
    path: 'webclient', 
    loadChildren: './client/client.module#ClientModule',
    canLoad: [ AuthGuard ]
  }
]

@NgModule({
  declarations: [
    MainComponent,
    CookieLawComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule,
    MainComponent,
  ],
  entryComponents: [
    CookieLawComponent
  ]
})
export class MainModule {}
