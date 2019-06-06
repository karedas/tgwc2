import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainComponent } from './main.component';
import { Auth2Module } from './authentication/auth.module';
import { Routes, RouterModule } from '@angular/router';
import { CookieLawComponent } from './client/components/windows/cookie-law/cookie-law.component';
import { AuthGuard } from '../core/services/auth.guard';
import { MainNavigationComponent } from './main-navigation/main-navigation.component';

const routes: Routes = [
  {
    path: 'manager',
    loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule),
  },
  {
    path: 'novita',
    loadChildren: () => import('./pages/global-news/global-news.module').then(m => m.GlobalNewsModule),
  },
  {
    path: '',
    redirectTo: 'manager',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  }
];


@NgModule({
  declarations: [
    MainComponent,
    CookieLawComponent,
    MainNavigationComponent
  ],
  imports: [
    RouterModule.forChild(routes),
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
export class MainModule { }
