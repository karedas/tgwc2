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
import { LoginService } from '../main/authentication/services/login.service';
import { IconsComponent } from '../main/common/icons/icons.component';

@NgModule({
  declarations: [
    IconsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    // Various
    NgScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    // font awesome
    FontAwesomeModule,
    ToastContainerModule,
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
    FormsModule,
    ReactiveFormsModule,
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
