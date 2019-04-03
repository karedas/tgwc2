import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommandsListComponent } from './commands-list/commands-list.component';
import { DialogModule } from 'primeng/dialog';
import { EditorComponent } from './editor/editor.component';

import { GenericTableComponent } from './generic-table/generic-table.component';
import { WorkslistComponent } from './workslist/workslist.component';
import { DialogGenericModule } from '../../common/dialog/dialog.module';
import { LoginSmartComponent } from './login-smart/login-smart.component';
import { NoFeatureComponent } from './no-feature/no-feature.component';
import { CharacterSheetComponent } from './character-sheet/character-sheet.component';
import { InfoComponent } from './character-sheet/info/info.component';
import { EquipInventoryComponent } from './character-sheet/equip-inventory/equip-inventory.component';
import { SkillsComponent } from './character-sheet/skills/skills.component';
import { BookComponent } from './book/book.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';

@NgModule({
  declarations: [
    GenericTableComponent,
    NoFeatureComponent,
    LoginSmartComponent,
    CommandsListComponent,
    EditorComponent,
    WorkslistComponent,
    CharacterSheetComponent,
    InfoComponent,
    EquipInventoryComponent,
    SkillsComponent,
    BookComponent,
    ControlPanelComponent
  ],
  imports: [
    DialogGenericModule,
    DialogModule,
    CommonModule,
    CheckboxModule,
    SharedModule,
  ],
  exports: [
    EditorComponent,
    CommandsListComponent,
    GenericTableComponent,
    WorkslistComponent,
    ControlPanelComponent,
    CharacterSheetComponent,
    BookComponent,
  ],
  entryComponents: [
    NoFeatureComponent,
    LoginSmartComponent,
    CommandsListComponent,
  ],
})

export class WindowsModule { }
