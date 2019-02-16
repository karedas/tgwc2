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

/* Prime NG */
import { CheckboxModule } from 'primeng/checkbox';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { DialogService as DynamicDialogService } from 'primeng/api';
import { GenericDialogService } from '../main/common/dialog/dialog.service';
import { HstatComponent } from '../main/common/hstat/hstat.component';


@NgModule({
  declarations: [
    IconsComponent,
    HstatComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    BrowserAnimationsModule,
    FlexLayoutModule.withConfig({
      useColumnBasisZero: false,
    }),
    // font awesome
    FontAwesomeModule,
    // Various
    // NgxDatatableModule,
    NgScrollbarModule,
    ToastContainerModule,
    /* Prime NG Modules (TODO: Moves in another file) */
    CheckboxModule,
    TableModule,
    MenubarModule,
    TooltipModule,
    ButtonModule,
    BrowserAnimationsModule
  ],
  providers: [
    GameService,
    CookieService,
    SocketService,
    PreloaderService,
    AudioService,
    LoginService,
    DynamicDialogService,
    GenericDialogService
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    PipesModule,
    ToastContainerModule,
    FontAwesomeModule,
    IconsComponent,
    HstatComponent,
    CheckboxModule,
    MenubarModule,
    TooltipModule,
    ButtonModule,
    TableModule,
    // NgxDatatableModule,
  ],
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
    };
  }

}
