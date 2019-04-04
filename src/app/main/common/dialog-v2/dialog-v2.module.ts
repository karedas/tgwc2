import { NgModule } from '@angular/core';
import { CookieLawComponent } from '../../client/windows/cookie-law/cookie-law.component';
import { MatDialogModule } from '@angular/material';
import { NewsComponent } from '../../client/windows/news/news.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginSmartComponent } from '../../client/windows/login-smart/login-smart.component';
import { EditorComponent } from '../../client/windows/editor/editor.component';
import { CharacterSheetComponent } from '../../client/windows/character-sheet/character-sheet.component';
import { CharacterSheetModule } from '../../client/windows/character-sheet/character-sheet.module';
import { ControlPanelComponent } from '../../client/windows/control-panel/control-panel.component';
import { BookComponent } from '../../client/windows/book/book.component';
import { CommandsListComponent } from '../../client/windows/commands-list/commands-list.component';
import { GenericTableComponent } from '../../client/windows/generic-table/generic-table.component';
import { NoFeatureComponent } from '../../client/windows/no-feature/no-feature.component';
import { WorkslistComponent } from '../../client/windows/workslist/workslist.component';

@NgModule({
  declarations: [
    CookieLawComponent,
    NewsComponent,
    LoginSmartComponent,
    EditorComponent,
    ControlPanelComponent,
    BookComponent,
    CommandsListComponent,
    GenericTableComponent,
    NoFeatureComponent,
    WorkslistComponent
  ],
  imports: [
    SharedModule,
    CharacterSheetModule,
    MatDialogModule,
  ],

  entryComponents: [
    CookieLawComponent,
    NewsComponent,
    LoginSmartComponent,
    EditorComponent,
    CharacterSheetComponent,
    ControlPanelComponent,
    BookComponent,
    CommandsListComponent,
    GenericTableComponent,
    NoFeatureComponent,
    WorkslistComponent
  ]
})
export class DialogV2Module { }
