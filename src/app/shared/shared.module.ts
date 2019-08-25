import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TooltipModule } from 'ng2-tooltip-directive';
// My Modules and Components
import { ClickStopPropagationDirective } from './directives/click-stop-propagation.directive';
import { PipesModule } from '../pipes/pipes.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AutofocusInputbarDirective } from './directives/autofocus-inputbar.directive';
import { MatRadioModule } from '@angular/material/radio';
import { IconsComponent } from '../main/client/common/icons/icons.component';
import { HstatComponent } from '../main/client/common/hstat/hstat.component';
import { MatRippleModule, MatTooltipModule, MatTableModule, MatPaginatorModule, MatInputModule } from '@angular/material';
import {ScrollingModule as ExperimentalScrollingModule, ScrollingModule} from '@angular/cdk-experimental/scrolling';

@NgModule({
  declarations: [
    ClickStopPropagationDirective,
    AutofocusInputbarDirective,
    IconsComponent,
    HstatComponent
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
    PipesModule,
    TooltipModule,
    ClickStopPropagationDirective,

    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    MatRippleModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatDialogModule,
    MatSidenavModule,
    MatRadioModule,


    ScrollingModule,
    ExperimentalScrollingModule,
  ],
})
export class SharedModule {}
