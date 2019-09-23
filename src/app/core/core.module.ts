import { NgModule, Optional, SkipSelf, Injectable, ErrorHandler } from '@angular/core';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpErrorInterceptor } from './interceptor/http.interceptor';
import { SharedModule } from '../shared/shared.module';
import { ApolloModule, APOLLO_OPTIONS } from "apollo-angular";
import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import * as Sentry from '@sentry/browser';
import { environment } from 'src/environments/environment';


if (environment.production) {
  Sentry.init({
    dsn: 'https://4703a40d72734be383834a9100b66168@sentry.io/1511377'
  });
}

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    if (environment.production) {
      const eventId = Sentry.captureException(error.originalError || error);
      // Sentry.showReportDialog({ eventId });
    } else {}
    console.error(error);
  }
}


@NgModule({
  imports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    SharedModule,
  ],
  declarations: [],
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
      if (parentModule) {
          throw new Error(
              'Core Module is already loaded. Import it in the AppModule only');
      }
  }

  static forRoot(): ModuleWithProviders {
      return {
          ngModule: CoreModule,
          providers: [
            { provide: ErrorHandler, useClass: SentryErrorHandler },
            { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
            {
              provide: APOLLO_OPTIONS,
              useFactory: (httpLink: HttpLink) => {
                return {
                  cache: new InMemoryCache(),
                  link: httpLink.create({
                    uri: environment.apiAddress
                  })
                }
              },
              deps: [HttpLink]
            }
          
          ]
          
      };
  }
}
