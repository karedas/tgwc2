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
import { DialogGenericModule } from '../main/common/dialog/dialog.module';


import {CheckboxModule} from 'primeng/checkbox';
import {MenubarModule} from 'primeng/menubar';
import {TooltipModule} from 'primeng/tooltip';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

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
    NgxDatatableModule,
    NgScrollbarModule,
    ToastContainerModule,
    /* Prime NG Modules (TODO: Moves in another file) */
    DialogGenericModule,
    CheckboxModule,
    MenubarModule,
    TooltipModule
    
  ],
  providers: [
    GameService,
    CookieService,
    SocketService,
    PreloaderService,
    AudioService,
    LoginService,
    // DialogService, {provide: MatDialogRef}
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
    DialogGenericModule,
    CheckboxModule,
    MenubarModule,
    TooltipModule,
    NgxDatatableModule
  ],
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
    };
  }

}
