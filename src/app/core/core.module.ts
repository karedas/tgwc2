import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { AuthService } from './services/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthJwtInterceptor } from './interceptor/http.interceptor';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ]
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
              // LoginService,
              AuthService,
              // LoaderService,
              {provide: HTTP_INTERCEPTORS, useClass: AuthJwtInterceptor, multi: true}
          ]
      };
  }
}
