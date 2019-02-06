import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterPanelComponent } from './character-panel/character-panel.component';
import { CombatPanelComponent } from './combat-panel/combat-panel.component';
import { ExtraboardComponent } from './extraboard/extraboard.component';
import { InputComponent } from './input/input.component';
import { GeolocalBoxComponent } from './extraboard/geolocal-box/geolocal-box.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    InputComponent,
    CharacterPanelComponent,
    CombatPanelComponent,
    ExtraboardComponent,
    GeolocalBoxComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
