import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../main/authentication/services/login.service';
import { PreloaderService } from '../main/common/services/preloader.service';
import { GenericDialogService } from '../main/common/dialog/dialog.service';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlexLayoutModule } from '@angular/flex-layout';


/* Prime NG */
import { CheckboxModule } from 'primeng/checkbox';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
// import { ContextMenuModule } from 'primeng/contextmenu';

import { DialogService as DynamicDialogService} from 'primeng/api';
import { ClickStopPropagationDirective } from './directives/click-stop-propagation.directive';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { SocketService } from '../services/socket.service';
import { PipesModule } from '../pipes/pipes.module';
import { IconsComponent } from '../main/common/icons/icons.component';
import { HstatComponent } from '../main/common/hstat/hstat.component';


@NgModule({
  declarations: [
    ClickStopPropagationDirective,
    IconsComponent,
    HstatComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule.withConfig({
      useColumnBasisZero: false,
    }),
    FontAwesomeModule,
    NgScrollbarModule,
    PipesModule,
    
    /* Prime NG Modules (TODO: Moves in another file) */
    DynamicDialogModule,
    CheckboxModule,
    TableModule,
    MenubarModule,
    TooltipModule,
    ButtonModule,
    // ContextMenuModule,
  ],
  providers: [
    SocketService,
    CookieService,
    PreloaderService,
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
    DynamicDialogModule,
    FontAwesomeModule,
    CheckboxModule,
    MenubarModule,
    TooltipModule,
    ButtonModule,
    TableModule,
    
    IconsComponent,
    HstatComponent,
    PipesModule,
    // ContextMenuModule,
    ClickStopPropagationDirective
  ],
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
    };
  }

}
