import { NgModule } from '@angular/core';
import { CookieLawComponent } from '../../client/windows/cookie-law/cookie-law.component';
import { MatDialogModule, MatSliderModule, MatRippleModule, MatPaginatorIntl } from '@angular/material';
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
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LogComponent } from '../../client/windows/log/log.component';
import { getItalianPaginatorIntl } from 'src/app/shared/intl/paginator-intl';

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
    WorkslistComponent,
    LogComponent
  ],

  imports: [
    SharedModule,
    DragDropModule,
    CharacterSheetModule,
    MatDialogModule,
    MatSliderModule,
    MatRippleModule
  ],

  entryComponents: [
    CookieLawComponent,
    NewsComponent,
    LoginSmartComponent,
    EditorComponent,
    ControlPanelComponent,
    BookComponent,
    CommandsListComponent,
    GenericTableComponent,
    NoFeatureComponent,
    WorkslistComponent,
    CharacterSheetComponent,
    LogComponent
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: getItalianPaginatorIntl}],
})

export class DialogV2Module { }
