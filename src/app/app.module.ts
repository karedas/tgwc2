import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import 'hammerjs';

import { AppComponent } from './app.component';

import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from 'src/environments/environment';

import { AppPreloadingStrategy } from './app.preloading-strategy';
import { baseReducer, clearState } from './store';
import { Auth2Module } from './main/authentication/auth.module';
import { GoogleAnalyticsService } from './services/google-analytics-service.service';
import { SplashscreenComponent } from './main/splashscreen/splashscreen.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainModule } from './main/main.module';
import { TgConfigModule } from './shared/tgconfig.module';
import { tgConfig } from './main/client/client-config';

@NgModule({
  declarations: [
    AppComponent,
    SplashscreenComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    Auth2Module,
    StoreModule.forRoot(baseReducer, { metaReducers: [clearState] }),
    EffectsModule.forRoot([]),
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    
    TgConfigModule.forRoot(tgConfig),
    MainModule,
    AppRoutingModule,
  ],
  providers: [AppPreloadingStrategy, GoogleAnalyticsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
