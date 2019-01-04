import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth2Module } from '../authentication/auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import {ToastModule} from 'primeng/toast';
import { GameService } from '../services/game.service';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from '../services/socket.service';
import { PreloadBarModule } from '../client/preload-bar/preload-bar.module';
import { PipesModule } from '../pipes/pipes.module';
import {ScrollPanelModule} from 'primeng/scrollpanel';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    DialogModule,
    Auth2Module,
    FormsModule,
    ReactiveFormsModule,
    PreloadBarModule,
    PipesModule,
    ScrollPanelModule
  ],
  providers: [
    GameService,
    CookieService,
    SocketService,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    Auth2Module,
    DialogModule,
    PipesModule,
    ScrollPanelModule
  ]
})
export class SharedModule {
  static forRoot() {
    return {
        ngModule: SharedModule,
    };
  }
 }
