import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginSmartComponent } from '../../components/windows/login-smart/login-smart.component';
import { EditorComponent } from '../../components/windows/editor/editor.component';
import { CharacterSheetComponent } from '../../components/windows/character-sheet/character-sheet.component';
import { CharacterSheetModule } from '../../components/windows/character-sheet/character-sheet.module';
import { BookComponent } from '../../components/windows/book/book.component';
import { CommandsListComponent } from '../../components/windows/commands-list/commands-list.component';
import { GenericTableComponent } from '../../components/windows/generic-table/generic-table.component';
import { WorkslistComponent } from '../../components/windows/workslist/workslist.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LogComponent } from '../../components/windows/log/log.component';
import { ControlPanelModule } from '../../components/windows/control-panel/control-panel.module';
import { ShortcutsPanelComponent } from '../../components/windows/shortcuts-panel/shortcuts-panel.component';
import { MatPaginatorIntl } from '@angular/material';
import { GetItalianPaginatorIntl } from 'src/app/shared/intl/paginator-intl';
import { SelectableGenericComponent } from '../../components/windows/selectable-generic/selectable-generic.component';
import { WindowWrapperModule } from '../../components/windows/window-wrapper/window-wrapper.module';
import { BaseWindowComponent } from '../../components/windows/base-window/base-window.component';

@NgModule({
  declarations: [
    BaseWindowComponent,
    ShortcutsPanelComponent,
    LoginSmartComponent,
    EditorComponent,
    BookComponent,
    CommandsListComponent,
    GenericTableComponent,
    WorkslistComponent,
    LogComponent,
    ShortcutsPanelComponent,
    CharacterSheetComponent,
    SelectableGenericComponent,
  ],

  imports: [
    SharedModule,
    DragDropModule,
    CharacterSheetModule,
    MatDialogModule,
    WindowWrapperModule,
    ControlPanelModule
  ],

  entryComponents: [
    BaseWindowComponent,
    LoginSmartComponent,
    EditorComponent,
    BookComponent,
    CommandsListComponent,
    GenericTableComponent,
    WorkslistComponent,
    CharacterSheetComponent,
    LogComponent,
    ShortcutsPanelComponent,
    SelectableGenericComponent,

  ],
  providers: [{ provide: MatPaginatorIntl, useClass: GetItalianPaginatorIntl}]
})

export class DialogV2Module { }
