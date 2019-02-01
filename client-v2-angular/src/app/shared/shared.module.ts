import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { FlexLayoutModule } from '@angular/flex-layout';

import {MatDialogModule, MatCheckboxModule, MatDialogRef, MatMenuModule, MatTooltipModule, MatToolbarModule} from "@angular/material";
import {DragDropModule} from '@angular/cdk/drag-drop';

import { DialogModule } from '../main/common/dialog/dialog.module';
import { DialogService } from '../main/common/dialog/dialog.service';


@NgModule({
  declarations: [
    IconsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    PipesModule,
    FlexLayoutModule.withConfig({
      useColumnBasisZero: false,
    }),
    // font awesome
    FontAwesomeModule,
    // Various
    NgScrollbarModule,
    
    FormsModule,
    ToastContainerModule,
    DialogModule,
    MatDialogModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTooltipModule,
    MatToolbarModule,
    DragDropModule
    
  ],
  providers: [
    GameService,
    CookieService,
    SocketService,
    PreloaderService,
    AudioService,
    LoginService,
    DialogService, {provide: MatDialogRef}
  ],
  exports: [
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgScrollbarModule,
    PipesModule,
    ToastContainerModule,
    FontAwesomeModule,
    IconsComponent,
    MatDialogModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTooltipModule,
    DragDropModule,
    MatToolbarModule
  ],
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
    };
  }

}
