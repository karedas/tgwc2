import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';


import { NgScrollbarModule } from 'ngx-scrollbar';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TooltipModule } from 'ng2-tooltip-directive';

/* Material Design */
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
// My Modules and Components
import { ClickStopPropagationDirective } from './directives/click-stop-propagation.directive';
// import { PipesModule } from '../pipes/pipes.module';
// import { IconsComponent } from '../main/client/common/icons/icons.component';
// import { HstatComponent } from '../main/client/common/hstat/hstat.component';

// // My Services
// import { AudioService } from '../main/client/components/audio/audio.service';
// import { ConfigService } from '../services/config.service';
// import { DialogV2Service } from '../main/client/common/dialog-v2/dialog-v2.service';
import { SplashScreenService } from '../main/splashscreen/splashscreen.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CapitalizeFirstPipe } from '../pipes/capitalizeFirst';
import { PipesModule } from '../pipes/pipes.module';
// import { LoginService } from '../main/authentication/services/login.service';
// import { GameService } from '../main/client/services/game.service';
// import { InputService } from '../main/client/components/input/input.service';
// import { LogService } from '../services/log.service';
// import { AutofocusInputbarDirective } from './directives/autofocus-inputbar.directive';


@NgModule({
  declarations: [
    ClickStopPropagationDirective,
    // AutofocusInputbarDirective,
    // IconsComponent,
    // HstatComponent
    
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
    MatTooltipModule,
    // MatProgressBarModule,
    MatSortModule,
    MatRippleModule,
    MatRadioModule,
    MatDialogModule
  ],

  exports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    // IconsComponent,
    // HstatComponent,
    PipesModule,
    // TooltipModule,
    ClickStopPropagationDirective,
    // AutofocusInputbarDirective,
    /** Angular Material  */
    MatCheckboxModule,
    MatSidenavModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatDialogModule,
    MatSortModule,
    MatRippleModule,
    MatRadioModule
  ],
  providers: [
    CookieService,
    SplashScreenService,
    // ConfigService,
    // GameService,
    // LoginService,
    // InputService,
    // AudioService,
    // DialogV2Service,
    // LogService,
    // InputService,
  ]
})
export class SharedModule {}
