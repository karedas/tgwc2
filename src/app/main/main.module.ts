import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainComponent } from './main.component';
import { Auth2Module } from './authentication/auth.module';
import { Routes, RouterModule } from '@angular/router';
import { MainNavigationModule } from './main-navigation/main-navigation.module';
import { CookieLawComponent } from './client/components/windows/cookie-law/cookie-law.component';
import { Error403Module } from './pages/errors/403/error-403.module';
import { SidenavService } from './manager/services/sidenav.service';
import { CookieService } from 'ngx-cookie-service';
import { SplashScreenService } from './splashscreen/splashscreen.service';

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
  }
];

@NgModule({
  declarations: [
    MainComponent,
    CookieLawComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    Auth2Module,
    Error403Module,
    MainNavigationModule
  ],
  exports: [
    MainComponent,
  ],
  entryComponents: [
    CookieLawComponent
  ],
  providers: [
    CookieService,
    SidenavService,
    SplashScreenService
  ]
})

export class MainModule { }
