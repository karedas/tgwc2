import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { GameService } from '../services/game.service';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from '../services/socket.service';
import { LoginService } from '../main/authentication/services/login.service';
import { AudioService } from '../main/client/audio/audio.service';
import { PreloaderService } from '../main/common/services/preloader.service';
import { GenericDialogService } from '../main/common/dialog/dialog.service';

import { IconsComponent } from '../main/common/icons/icons.component';
import { HstatComponent } from '../main/common/hstat/hstat.component';

import { PipesModule } from '../pipes/pipes.module';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlexLayoutModule } from '@angular/flex-layout';


/* Prime NG */
import { CheckboxModule } from 'primeng/checkbox';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ContextMenuModule } from 'primeng/contextmenu';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

import { DialogService as DynamicDialogService, MenuItem} from 'primeng/api';
import { ClickStopPropagation } from './directives/click-stop-propagation.directive';


@NgModule({
  declarations: [
    IconsComponent,
    HstatComponent,
    ClickStopPropagation
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    FlexLayoutModule.withConfig({
      useColumnBasisZero: false,
    }),
    FontAwesomeModule,
    NgScrollbarModule,
    /* Prime NG Modules (TODO: Moves in another file) */
    CheckboxModule,
    TableModule,
    MenubarModule,
    TooltipModule,
    ButtonModule,
    ContextMenuModule,
    ProgressSpinnerModule
  ],
  providers: [
    GameService,
    CookieService,
    SocketService,
    PreloaderService,
    AudioService,
    LoginService,
    DynamicDialogService,
    GenericDialogService,
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    PipesModule,
    FontAwesomeModule,
    IconsComponent,
    HstatComponent,
    CheckboxModule,
    MenubarModule,
    TooltipModule,
    ProgressSpinnerModule,
    ButtonModule,
    TableModule,
    ContextMenuModule,
    ClickStopPropagation
  ],
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
    };
  }

}
