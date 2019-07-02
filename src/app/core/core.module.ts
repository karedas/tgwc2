import { NgModule, Optional, SkipSelf } from '@angular/core';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { AuthService } from './services/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthJwtInterceptor } from './interceptor/http.interceptor';
import { SharedModule } from '../shared/shared.module';
import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';

@NgModule({
  imports: [
    HttpClientModule,
    SharedModule,
  ],
  declarations: [
    // ManagerComponent
  ],
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
            UserService,
            ApiService,
            AuthService,
            {provide: HTTP_INTERCEPTORS, useClass: AuthJwtInterceptor, multi: true}
          ]
      };
  }
}
