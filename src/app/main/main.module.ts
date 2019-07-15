import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainComponent } from './main.component';
import { Auth2Module } from './authentication/auth.module';
import { Routes, RouterModule } from '@angular/router';
import { MainNavigationModule } from './common/components/main-navigation/main-navigation.module';
import { CookieLawComponent } from './common/components/dialogs/cookie-law/cookie-law.component';
import { Error403Module } from './pages/errors/403/error-403.module';
import { CookieService } from 'ngx-cookie-service';
import { SplashScreenService } from './common/components/splashscreen/splashscreen.service';
import { HelpComponent } from './pages/help/help.component';
import { MatListModule, MatToolbarModule } from '@angular/material';
import { SidebarComponent } from './common/components/sidebar-content/sidebar.component';
import { SocketService } from '../core/services/socket.service';
import { AlertComponent } from './common/components/dialogs/alert/alert.component';

const routes: Routes = [
  {
    path: 'manager',
    loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule)
  },
  {
    path: 'webclient',
    loadChildren: () => import('./client/client.module').then( m => m.ClientModule)
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
    CookieLawComponent,
    AlertComponent,
    SidebarComponent,
    HelpComponent
  ],
  imports: [
    MatListModule,
    MatToolbarModule,
    SharedModule,
    Error403Module,
    Auth2Module,
    MainNavigationModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    MainComponent,
  ],
  entryComponents: [
    AlertComponent,
    CookieLawComponent
  ],
  providers: [
    SocketService,
    CookieService,
    SplashScreenService,
  ]
})

export class MainModule { }
