import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { ClientModule } from './client/client.module';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools'

import { SocketService } from './services/socket.service';
import { GameService } from './services/game.service';
import { SharedModule } from './shared/shared.module';
import * as fromStore from './store/'
/** DA SPOSTARE IN SHARED MODULE */

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { ClientEffects } from './store/effects/client.effects';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    SharedModule,
    ClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(fromStore.reducers),
    EffectsModule.forRoot([ClientEffects]),
    LoggerModule.forRoot({ 
      serverLoggingUrl: '/api/logs', 
      level: NgxLoggerLevel.DEBUG, 
      serverLogLevel: NgxLoggerLevel.ERROR 
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      // logOnly: environment.production, // Restrict extension to log-only mode
    }),
    AppRoutingModule
  ],
  providers: [SocketService, CookieService, GameService, PreloaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
