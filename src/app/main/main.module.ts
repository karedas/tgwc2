import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { WindowsModule } from './client/windows/windows.module';
import { AuthGuard } from './authentication/services/login.guard';

export const routes = [
  {
    path: 'webclient', 
    loadChildren: './main/client/client.module#ClientModule',
    canLoad: [ AuthGuard ]
  }
]


@NgModule({
  declarations: [
    MainComponent,
  ],
  imports: [
    WindowsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule,
    MainComponent
  ],
})
export class MainModule {
 }
