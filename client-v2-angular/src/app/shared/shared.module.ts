import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth2Module } from '../authentication/auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import {ToastModule} from 'primeng/toast';
import { GameService } from '../services/game.service';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from '../services/socket.service';
import { PreloaderService } from '../services/preloader.service';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    DialogModule,
    Auth2Module,
    FormsModule,
    ReactiveFormsModule,
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
    DialogModule
  ]
})
export class SharedModule {
  static forRoot() {
    return {
        ngModule: SharedModule,
    };
  }
 }
