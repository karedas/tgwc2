import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GameService } from '../services/game.service';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from '../services/socket.service';
import { PipesModule } from '../pipes/pipes.module';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { Auth2Module } from '../main/authentication/auth.module';
import { PreloaderService } from '../main/client/common/services/preloader.service';
import { AudioService } from '../main/client/audio/audio.service';



import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastContainerModule } from 'ngx-toastr';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Auth2Module,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    // Various
    NgScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    //font awesome
    FontAwesomeModule,
    ToastContainerModule,
  ],
  providers: [
    GameService,
    CookieService,
    SocketService,
    PreloaderService,
    AudioService,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgScrollbarModule,
    PipesModule,
    ToastContainerModule,
    FontAwesomeModule,
    
  ],
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
    };
  }

}
