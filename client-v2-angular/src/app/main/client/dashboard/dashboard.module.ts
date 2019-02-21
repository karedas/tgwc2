import { NgModule } from '@angular/core';
import { CharacterPanelComponent } from './character-panel/character-panel.component';
import { CombatPanelComponent } from './combat-panel/combat-panel.component';
import { ExtraboardComponent } from './extraboard/extraboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { InputModule } from './input/input.module';

@NgModule({
  declarations: [
    CharacterPanelComponent,
    CombatPanelComponent,
    ExtraboardComponent,
    DashboardComponent,
  ],
  imports: [
    InputModule,
    SharedModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
