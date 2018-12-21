import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { SocketService } from './services/socket.service';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';

import { ClientModule } from './client/client.module';
import { AppRoutingModule } from './app-routing.module';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
// import { reducers } from './store/reducers/game.reducer'
import * as fromStore from './store/'
import { GameService } from './services/game.service';
import { EffectsModule } from '@ngrx/effects';
import { MessageEffects } from './store/effects/message.effects';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    ClientModule,
    LoggerModule.forRoot({ 
      serverLoggingUrl: '/api/logs', 
      level: NgxLoggerLevel.DEBUG, 
      serverLogLevel: NgxLoggerLevel.ERROR 
    }),
    StoreModule.forRoot(fromStore.reducers),
    EffectsModule.forRoot([MessageEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      // logOnly: environment.production, // Restrict extension to log-only mode
    }),
    AppRoutingModule
  ],
  providers: [SocketService, CookieService, GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
