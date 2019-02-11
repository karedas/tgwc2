import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { CookieLawComponent } from '../../client/windows/cookie-law/cookie-law.component';
import { CheckboxModule } from 'primeng/checkbox';
import { SharedModule } from 'src/app/shared/shared.module';
import { WelcomeNewsComponent } from './welcome-news/welcome-news.component';
import { CommandsListComponent } from './commands-list/commands-list.component';
import { DialogModule } from 'primeng/dialog';
import { EditorComponent } from './editor/editor.component';

import { GenericTableComponent } from './generic-table/generic-table.component';
import { WorkslistComponent } from './workslist/workslist.component';
import { DialogGenericModule } from '../../common/dialog/dialog.module';
import { LoginSmartComponent } from './login-smart/login-smart.component';
import { NoFeatureComponent } from './no-feature/no-feature.component';
import { WindowsService } from './windows.service';
import { CharacterSheetComponent } from './character-sheet/character-sheet.component';
import { InfoComponent } from './character-sheet/info/info.component';
import { EquipInventoryComponent } from './character-sheet/equip-inventory/equip-inventory.component';
import { SkillsComponent } from './character-sheet/skills/skills.component';

@NgModule({
  declarations: [
    GenericTableComponent,
    NoFeatureComponent,
    LoginSmartComponent,
    CommandsListComponent,
    WelcomeNewsComponent,
    CookieLawComponent,
    CommandsListComponent,
    EditorComponent,
    WorkslistComponent,
    CharacterSheetComponent,
    InfoComponent,
    EquipInventoryComponent,
    SkillsComponent
  ],
  imports: [
    DynamicDialogModule,
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
  ],
  entryComponents: [
    NoFeatureComponent,
    LoginSmartComponent,
    CommandsListComponent,
    WelcomeNewsComponent,
    CookieLawComponent,
    CharacterSheetComponent
  ],
  providers: [
    WindowsService
  ]
})
export class WindowsModule { }
