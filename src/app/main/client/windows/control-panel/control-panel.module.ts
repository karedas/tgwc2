import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortcutsManagerComponent } from './shortcuts-manager/shortcuts-manager.component';
import { ControlPanelComponent } from './control-panel.component';
import { MatDialogModule, MatIconModule, MatDividerModule, MatSliderModule, MatButtonModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ControlPanelComponent,
    ShortcutsManagerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatDialogModule,
    MatSliderModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ],
  entryComponents: [
    ControlPanelComponent
  ]
})
export class ControlPanelModule { }
