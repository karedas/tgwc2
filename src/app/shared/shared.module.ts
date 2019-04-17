import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { CookieService } from 'ngx-cookie-service';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TooltipModule } from 'ng2-tooltip-directive';

/* Material Design */
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatProgressBarModule } from '@angular/material';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';


// My Modules and Components
import { ClickStopPropagationDirective } from './directives/click-stop-propagation.directive';
import { PipesModule } from '../pipes/pipes.module';
import { IconsComponent } from '../main/common/icons/icons.component';
import { HstatComponent } from '../main/common/hstat/hstat.component';

// My Services
import { AudioService } from '../main/client/audio/audio.service';
import { ConfigService } from '../services/config.service';
import { DialogV2Service } from '../main/common/dialog-v2/dialog-v2.service';
import { SplashScreenService } from '../main/splashscreen/splashscreen.service';
import { LoginService } from '../main/authentication/services/login.service';
import { GameService } from '../main/client/services/game.service';
import { InputService } from '../main/client/input/input.service';
import { LogService } from '../services/log.service';


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

    NgScrollbarModule,
    TooltipModule,
    PipesModule,
    /** Angular Material Modules */
    MatCheckboxModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule
  ],

  exports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    IconsComponent,
    HstatComponent,
    PipesModule,
    TooltipModule,
    ClickStopPropagationDirective,
    /** Angular Material  */
    MatCheckboxModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        GameService,
        ConfigService,
        CookieService,
        SplashScreenService,
        LoginService,
        InputService,
        AudioService,
        DialogV2Service,
        LogService,
        InputService,
      ]
    };
  }

}
