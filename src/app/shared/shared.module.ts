import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TooltipModule } from 'ng2-tooltip-directive';
// My Modules and Components
import { ClickStopPropagationDirective } from './directives/click-stop-propagation.directive';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { IconsComponent } from '../main/client/common/icons/icons.component';
import { HstatComponent } from '../main/client/common/hstat/hstat.component';
import { MatRippleModule, MatTooltipModule, MatTableModule, MatPaginatorModule, MatInputModule, MatExpansionModule, MatListModule, MatSortModule } from '@angular/material';
import { ScrollingModule } from '@angular/cdk-experimental/scrolling';
import { PipesModule } from '../pipes/pipes.module';

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

    ScrollingModule,
  ],

})
export class SharedModule {}
