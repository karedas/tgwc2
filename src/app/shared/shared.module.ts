import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatExpansionModule,
  MatInputModule,
  MatListModule,
  MatPaginatorModule,
  MatRippleModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule,
} from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TooltipModule } from 'ng2-tooltip-directive';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollbarReachedModule } from 'ngx-scrollbar/reached-event';

import { HstatComponent } from '../main/client/common/hstat/hstat.component';
import { IconsComponent } from '../main/client/common/icons/icons.component';
import { PipesModule } from '../pipes/pipes.module';
import { ClickStopPropagationDirective } from './directives/click-stop-propagation.directive';

// My Modules and Components
@NgModule({
  declarations: [
    ClickStopPropagationDirective,
    HstatComponent,
    IconsComponent
  ],
  imports: [
    FlexLayoutModule.withConfig({
      useColumnBasisZero: false,
    }),
  ],

  exports: [
    CommonModule,
    IconsComponent,
    HstatComponent,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    NgScrollbarReachedModule,
    PipesModule,
    TooltipModule,
    ClickStopPropagationDirective,

    MatListModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    MatRippleModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatSortModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatDialogModule,
    MatSidenavModule,
    MatRadioModule,
    MatExpansionModule,
  ],
})
export class SharedModule {}
