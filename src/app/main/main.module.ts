import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { SharedModule } from 'src/app/shared/shared.module';

import { SocketService } from '../core/services/socket.service';
import { Auth2Module } from './authentication/auth.module';
import { LoginClientGuard } from './authentication/services/login-client.guard';
import { LoginClientService } from './authentication/services/login-client.service';
import { DialogV2Module } from './client/common/dialog-v2/dialog-v2.module';
import { DialogV2Service } from './client/common/dialog-v2/dialog-v2.service';
import { DataParser } from './client/services/dataParser.service';
import { GameService } from './client/services/game.service';
import { LogService } from './client/services/log.service';
import { baseReducer, clearState } from './client/store';
import { ClientEffects } from './client/store/effects/client.effects';
import { AlertComponent } from './common/components/dialogs/alert/alert.component';
import { CookieLawComponent } from './common/components/dialogs/cookie-law/cookie-law.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { NavBarModule } from './common/components/navigation/navbar/navbar.module';
import { SidenavComponent } from './common/components/navigation/sidenav/sidenav.component';
import { SplashScreenService } from './common/components/splashscreen/splashscreen.service';
import { MainComponent } from './main.component';
import { Error403Module } from './pages/errors/403/error-403.module';
import { HelpComponent } from './pages/help/help.component';
import { AudioService } from './client/components/audio/audio.service';
import { WindowWrapperModule } from './client/components/windows/window-wrapper/window-wrapper.module';

const routes: Routes = [
  {
    path: 'webclient',
    loadChildren: () => import('./client/client.module').then( m => m.ClientModule),
    canLoad: [LoginClientGuard]
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
    WindowWrapperModule,
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
    CookieService,
    SplashScreenService,
    LogService,
    DataParser,
    GameService,
    AudioService
  ]
})

export class MainModule { }
