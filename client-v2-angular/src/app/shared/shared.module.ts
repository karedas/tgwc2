import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth2Module } from '../authentication/auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GameService } from '../services/game.service';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from '../services/socket.service';
import { PipesModule } from '../pipes/pipes.module';
import { PreloaderService } from '../client/common/services/preloader.service';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    Auth2Module,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
  ],
  providers: [
    GameService,
    CookieService,
    SocketService,
    PreloaderService
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    Auth2Module,
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
