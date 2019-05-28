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
import { GoogleAnalyticsService } from './services/google-analytics-service.service';
import { SplashscreenComponent } from './main/splashscreen/splashscreen.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainModule } from './main/main.module';
import { TgConfigModule } from './shared/tgconfig.module';
import { tgConfig } from './main/client/client-config';
import { baseReducer, clearState } from './store';
import { ClientEffects } from './store/effects/client.effects';
import { DataEffects } from './store/effects/data.effects';

import { DialogV2Module } from './main/client/common/dialog-v2/dialog-v2.module';
import 'hammerjs';
import { AngularSplitModule } from 'angular-split';
import { PageNotFoundComponent } from './main/pages/page-not-found/page-not-found.component';
import { CoreModule } from './core/core.module';
import { JwtModule } from '@auth0/angular-jwt';

@NgModule({

  declarations: [
    AppComponent,
    PageNotFoundComponent,
    SplashscreenComponent,
  ],

  imports: [
		CoreModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TgConfigModule.forRoot(tgConfig),
    StoreModule.forRoot(baseReducer, { metaReducers: [clearState] }),
    EffectsModule.forRoot([ClientEffects, DataEffects]),

    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),

    JwtModule.forRoot({
			config: {
				tokenGetter: () => {
					return localStorage.getItem('token');
				}
			}
		}),

    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR,
    }),

    // TODO: I'll need to move out.
    AngularSplitModule.forRoot(),
    DialogV2Module,
    /** --------------------- */
    MainModule,
    AppRoutingModule,
  ],
  exports: [
    AngularSplitModule
  ],
  providers: [
    AppPreloadingStrategy,
    GoogleAnalyticsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
