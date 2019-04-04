import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterSheetComponent } from './character-sheet.component';
import { InfoComponent } from './info/info.component';
import { SkillsComponent } from './skills/skills.component';
import { EquipInventoryComponent } from './equip-inventory/equip-inventory.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    CharacterSheetComponent,
    InfoComponent,
    EquipInventoryComponent,
    SkillsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    CharacterSheetComponent
  ]
})
export class CharacterSheetModule { }
