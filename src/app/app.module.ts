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
import { SplashscreenComponent } from './main/common/components/splashscreen/splashscreen.component';
import { MainModule } from './main/main.module';
import { CoreModule } from './core/core.module';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { tgConfig } from './main/client/client-config';
import { TgConfigModule } from './shared/tgconfig.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';


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
        tokenGetter: tokenGetter
      }
    }),
    TgConfigModule.forRoot(tgConfig),
    
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),

    // TODO: I'll need to move out.
    // AngularSplitModule.forRoot(),
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
