import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth2Module } from '../authentication/auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GameService } from '../services/game.service';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from '../services/socket.service';
import { PipesModule } from '../pipes/pipes.module';
import { PreloaderService } from '../client/common/services/preloader.service';
import { AudioService } from '../client/audio/audio.service';

import { NgScrollbarModule } from 'ngx-scrollbar';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    Auth2Module,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    // Various
    NgScrollbarModule
  ],
  providers: [
    GameService,
    CookieService,
    SocketService,
    PreloaderService,
    AudioService
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    Auth2Module,
    NgScrollbarModule,
    PipesModule,
  ],
})
export class SharedModule {
  static forRoot() {
    return {
        ngModule: SharedModule,
    };
  }
 }
