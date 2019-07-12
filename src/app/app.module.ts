import { NgModule } from '@angular/core';
import 'hammerjs';
import { AppComponent } from './app.component';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { AppPreloadingStrategy } from './app.preloading-strategy';
import { GoogleAnalyticsService } from './services/google-analytics-service.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SplashscreenComponent } from './main/splashscreen/splashscreen.component';
import { MainModule } from './main/main.module';
import { CoreModule } from './core/core.module';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';


export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    SplashscreenComponent,
  ],

  imports: [
    CoreModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LoggerModule.forRoot({serverLoggingUrl: '/logs', level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.ERROR}),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    }),
    // TgConfigModule.forRoot(tgConfig),
    // StoreModule.forRoot(baseReducer, { metaReducers: [clearState] }),
    // EffectsModule.forRoot([ClientEffects, DataEffects]),

    // TODO: I'll need to move out.
    // AngularSplitModule.forRoot(),
    // DialogV2Module,
    /** --------------------- */
    MainModule,
    AppRoutingModule,
  ],
  exports: [
    // AngularSplitModule
  ],
  providers: [
    AppPreloadingStrategy,
    GoogleAnalyticsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
