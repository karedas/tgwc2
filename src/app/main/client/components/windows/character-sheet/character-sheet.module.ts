import { NgModule } from '@angular/core';
import { CharacterSheetComponent } from './character-sheet.component';
import { InfoComponent } from './info/info.component';
import { SkillsComponent } from './skills/skills.component';
import { EquipInventoryComponent } from './equip-inventory/equip-inventory.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    CharacterSheetComponent,
    InfoComponent,
    EquipInventoryComponent,
    SkillsComponent
  ],
  imports: [
    MatDialogModule,
    DragDropModule,
    SharedModule,
  ],
  exports: [
    CharacterSheetComponent
  ],
})

export class CharacterSheetModule { }
