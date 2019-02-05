import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import 'hammerjs';

import { AppComponent } from './app.component';

import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { SharedModule } from './shared/shared.module';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { ClientModule } from './main/client/client.module';

import { ToastrModule } from 'ngx-toastr';
import { AppPreloadingStrategy } from './app.preloading-strategy';
import { appReducer, clearState } from './store';
import { UiEffects } from './store/effects/ui.effects';
import { ClientEffects } from './store/effects/client.effects';
import { Auth2Module } from './main/authentication/auth.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot(appReducer, { metaReducers: [clearState] }),
    EffectsModule.forRoot([UiEffects, ClientEffects]),
    ToastrModule.forRoot({
      positionClass: 'inline',
    }),
    LoggerModule.forRoot({
      serverLoggingUrl: '/api/logs',
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    SharedModule,
    ClientModule,
    Auth2Module,
    AppRoutingModule
  ],
  providers: [AppPreloadingStrategy],
  bootstrap: [AppComponent]
})
export class AppModule { }
