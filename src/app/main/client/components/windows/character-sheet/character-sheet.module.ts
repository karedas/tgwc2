import { NgModule } from '@angular/core';
import { InfoComponent } from './info/info.component';
import { SkillsComponent } from './skills/skills.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatExpansionModule} from '@angular/material';
import { EquipInventoryComponent } from './equip-inventory/equip-inventory.component';
import { HeroEquipmentModule } from '../../hero-equipment/hero-equipment.module';
import { HeroInventoryModule } from '../../hero-inventory/hero-inventory.module';

@NgModule({
  declarations: [
    InfoComponent,
    EquipInventoryComponent,
    SkillsComponent,
  ],
  imports: [
    MatDialogModule,
    DragDropModule,
    SharedModule,
    MatExpansionModule,
    HeroInventoryModule,
    HeroEquipmentModule
  ],
  exports: [
    SkillsComponent,
    EquipInventoryComponent,
    InfoComponent
  ],
})

export class CharacterSheetModule { }
