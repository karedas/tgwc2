import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../main/authentication/services/login.service';
// import { GenericDialogService } from '../main/common/dialog/dialog.service';
import { SplashScreenService } from '../main/splashscreen/splashscreen.service';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlexLayoutModule } from '@angular/flex-layout';


/* Prime NG */
// import { CheckboxModule } from 'primeng/checkbox';
// import { MenubarModule } from 'primeng/menubar';
// import { TooltipModule } from 'primeng/tooltip';
// import { ButtonModule } from 'primeng/button';
// import { TableModule } from 'primeng/table';
// import { DialogService as DynamicDialogService} from 'primeng/api';
// import { DynamicDialogModule } from 'primeng/dynamicdialog';


/* Material Design */
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';


import { ClickStopPropagationDirective } from './directives/click-stop-propagation.directive';
import { PipesModule } from '../pipes/pipes.module';
import { IconsComponent } from '../main/common/icons/icons.component';
import { HstatComponent } from '../main/common/hstat/hstat.component';
import { AudioService } from '../main/client/audio/audio.service';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { ConfigService } from '../services/config.service';
import { DialogV2Service } from '../main/common/dialog-v2/dialog-v2.service';
import { MatButtonModule } from '@angular/material';


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

    /** Angular Material Modules */
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
  ],

  exports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    FontAwesomeModule,

    /** Angular Material  */
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,


    IconsComponent,
    HstatComponent,

    PipesModule,
    ClickStopPropagationDirective
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        ConfigService,
        CookieService,
        SplashScreenService,
        LoginService,
        // DynamicDialogService,
        // GenericDialogService,
        AudioService,
        DialogV2Service
      ]
    };
  }

}
