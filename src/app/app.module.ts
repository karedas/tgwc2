import 'hammerjs';

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppPreloadingStrategy } from './app.preloading-strategy';
import { CoreModule } from './core/core.module';
import { tgConfig } from './main/client/client-config';
import { SplashscreenComponent } from './main/common/components/splashscreen/splashscreen.component';
import { MainModule } from './main/main.module';
import { GoogleAnalyticsService } from './services/google-analytics-service.service';
import { TgConfigModule } from './shared/tgconfig.module';


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
    JwtModule.forRoot({
      config: {
        tokenGetter
      }
    }),
    TgConfigModule.forRoot(tgConfig),

    StoreModule.forRoot({}, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: false,
        strictActionSerializability: true,
      },
    }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    MainModule,
    AppRoutingModule,
  ],
  exports: [
  ],
  providers: [
    AppPreloadingStrategy,
    GoogleAnalyticsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
