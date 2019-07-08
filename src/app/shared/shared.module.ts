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
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [
    ClickStopPropagationDirective,    
    AutofocusInputbarDirective,
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
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatDialogModule,
    MatSidenavModule,
    MatRadioModule,
    MatToolbarModule
  ],

  exports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    PipesModule,
    TooltipModule,
    ClickStopPropagationDirective,

    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatDialogModule,
    MatSidenavModule,
    MatRadioModule,
  ],
})
export class SharedModule {}
