import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainComponent } from './main.component';
import { Auth2Module } from './authentication/auth.module';
import { Routes, RouterModule } from '@angular/router';
import { CookieLawComponent } from './common/components/dialogs/cookie-law/cookie-law.component';
import { Error403Module } from './pages/errors/403/error-403.module';
import { CookieService } from 'ngx-cookie-service';
import { SplashScreenService } from './common/components/splashscreen/splashscreen.service';
import { HelpComponent } from './pages/help/help.component';
import { MatToolbarModule } from '@angular/material';
import { SocketService } from '../core/services/socket.service';
import { AlertComponent } from './common/components/dialogs/alert/alert.component';
import { LoginClientService } from './client/services/login-client.service';
import { GameService } from './client/services/game.service';
import { DataParser } from './client/services/dataParser.service';
import { LoginClientGuard } from './authentication/services/login-client.guard';
import { FooterComponent } from './common/components/footer/footer.component';
import { StoreModule } from '@ngrx/store';
import { baseReducer, clearState } from './client/store';
import { EffectsModule } from '@ngrx/effects';
import { ClientEffects } from './client/store/effects/client.effects';
import { DialogV2Service } from './client/common/dialog-v2/dialog-v2.service';
import { DialogV2Module } from './client/common/dialog-v2/dialog-v2.module';
import { NavBarModule } from './common/components/navigation/navbar/navbar.module';
import { SidenavComponent } from './common/components/navigation/sidenav/sidenav.component';
import { LogService } from './client/services/log.service';

const routes: Routes = [
  {
    path: 'webclient',
    loadChildren: () => import('./client/client.module').then( m => m.ClientModule),
    canLoad: [LoginClientGuard]
  },
  {
    path: 'novita',
    loadChildren: () => import('./pages/global-news/global-news.module').then(m => m.GlobalNewsModule),
  },
];

@NgModule({
  declarations: [
    MainComponent,
    CookieLawComponent,
    AlertComponent,
    SidenavComponent,
    HelpComponent,
    FooterComponent,
  ],
  imports: [
    MatToolbarModule,
    SharedModule,
    Error403Module,
    Auth2Module,
    DialogV2Module,
    NavBarModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('TG', baseReducer, { metaReducers: [clearState]}),
    EffectsModule.forFeature([ClientEffects]),
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
    DialogV2Service,
    LoginClientService,
    GameService,
    DataParser,
    CookieService,
    SplashScreenService,
    LogService
  ]
})

export class MainModule { }
