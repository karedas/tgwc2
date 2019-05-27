import { NgModule } from '@angular/core';
import { CookieLawComponent } from '../../components/windows/cookie-law/cookie-law.component';
import { MatDialogModule, MatSliderModule, MatPaginatorIntl, MatButtonModule } from '@angular/material';
import { NewsComponent } from '../../components/windows/news/news.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginSmartComponent } from '../../components/windows/login-smart/login-smart.component';
import { EditorComponent } from '../../components/windows/editor/editor.component';
import { CharacterSheetComponent } from '../../components/windows/character-sheet/character-sheet.component';
import { CharacterSheetModule } from '../../components/windows/character-sheet/character-sheet.module';
import { BookComponent } from '../../components/windows/book/book.component';
import { CommandsListComponent } from '../../components/windows/commands-list/commands-list.component';
import { GenericTableComponent } from '../../components/windows/generic-table/generic-table.component';
import { NoFeatureComponent } from '../../components/windows/no-feature/no-feature.component';
import { WorkslistComponent } from '../../components/windows/workslist/workslist.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LogComponent } from '../../components/windows/log/log.component';
import { getItalianPaginatorIntl } from 'src/app/shared/intl/paginator-intl';
import { ControlPanelModule } from '../../components/windows/control-panel/control-panel.module';
import { ShortcutsPanelComponent } from '../../components/windows/shortcuts-panel/shortcuts-panel.component';

@NgModule({
  declarations: [
    CookieLawComponent,
    NewsComponent,
    LoginSmartComponent,
    EditorComponent,
    BookComponent,
    CommandsListComponent,
    GenericTableComponent,
    NoFeatureComponent,
    WorkslistComponent,
    LogComponent,
    ShortcutsPanelComponent,
  ],

  imports: [
    SharedModule,
    DragDropModule,
    CharacterSheetModule,
    MatDialogModule,
    MatSliderModule,
    ControlPanelModule
  ],

  entryComponents: [
    CookieLawComponent,
    NewsComponent,
    LoginSmartComponent,
    EditorComponent,
    // ControlPanelComponent,
    BookComponent,
    CommandsListComponent,
    GenericTableComponent,
    NoFeatureComponent,
    WorkslistComponent,
    CharacterSheetComponent,
    LogComponent,
    ShortcutsPanelComponent
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: getItalianPaginatorIntl}]
})

export class DialogV2Module { }
