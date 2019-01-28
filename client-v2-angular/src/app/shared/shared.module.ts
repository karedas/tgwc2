import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GameService } from '../services/game.service';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from '../services/socket.service';
import { PipesModule } from '../pipes/pipes.module';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { PreloaderService } from '../main/common/services/preloader.service';
import { AudioService } from '../main/client/audio/audio.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastContainerModule } from 'ngx-toastr';
import { TooltipModule } from 'ngx-tooltip';
import { LoginService } from '../main/authentication/services/login.service';
import { IconsComponent } from '../main/common/icons/icons.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    IconsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    FlexLayoutModule,
    // font awesome
    FontAwesomeModule,
    // Various
    NgScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    ToastContainerModule,
    TooltipModule
  ],
  providers: [
    GameService,
    CookieService,
    SocketService,
    PreloaderService,
    AudioService,
    LoginService
  ],
  exports: [
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    CommonModule,
    NgScrollbarModule,
    PipesModule,
    ToastContainerModule,
    FontAwesomeModule,
    IconsComponent
  ],
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
    };
  }

}
