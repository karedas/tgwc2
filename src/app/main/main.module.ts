import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HistoryService } from 'src/app/services/history.service';
import { MainComponent } from './main.component';
import { Routes, RouterModule } from '@angular/router';
import { WindowsModule } from './client/windows/windows.module';

export const routes = [
  {
    path: 'webclient', 
    loadChildren: './main/client/client.module#ClientModule',
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
