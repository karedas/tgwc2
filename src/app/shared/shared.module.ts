import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { CookieService } from 'ngx-cookie-service';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TooltipModule } from "ngx-tooltip";

/* Material Design */
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material';

//My Modules and Components
import { ClickStopPropagationDirective } from './directives/click-stop-propagation.directive';
import { PipesModule } from '../pipes/pipes.module';
import { IconsComponent } from '../main/common/icons/icons.component';
import { HstatComponent } from '../main/common/hstat/hstat.component';

//My Services
import { AudioService } from '../main/client/audio/audio.service';
import { ConfigService } from '../services/config.service';
import { DialogV2Service } from '../main/common/dialog-v2/dialog-v2.service';
import { SplashScreenService } from '../main/splashscreen/splashscreen.service';
import { LoginService } from '../main/authentication/services/login.service';


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
    TooltipModule,

    PipesModule,
    
    /** Angular Material Modules */
    MatCheckboxModule,
    MatMenuModule,
    MatButtonModule,
    // MatTooltipModule,
  ],

  exports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    TooltipModule,
    FontAwesomeModule,
    IconsComponent,
    HstatComponent,
    PipesModule,
    ClickStopPropagationDirective,
    /** Angular Material  */
    MatCheckboxModule,
    MatMenuModule,
    MatButtonModule,
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
