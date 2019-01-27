import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeNewsComponent } from './welcome-news/welcome-news.component';
import { CookieLawComponent } from './cookie-law/cookie-law.component';
import { NoFeatureComponent } from './no-feature/no-feature.component';
import { DialogModule } from '../../common/dialog/dialog.module';
import { LoginSmartComponent } from './login-smart/login-smart.component';
import { EditorComponent } from './editor/editor.component';
import { CharacterSheetComponent } from './character-sheet/character-sheet.component';
import { CommandsListComponent } from './commands-list/commands-list.component';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { IconsComponent } from '../../common/icons/icons.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    WelcomeNewsComponent,
    CookieLawComponent,
    NoFeatureComponent,
    LoginSmartComponent,
    EditorComponent,
    CharacterSheetComponent,
    CommandsListComponent,
    GenericTableComponent,

  ],
  imports: [
    CommonModule,
    DialogModule,
    SharedModule
  ],
  exports: [
    WelcomeNewsComponent,
    CookieLawComponent,
    NoFeatureComponent,
    LoginSmartComponent,
    EditorComponent,
    CommandsListComponent,
    GenericTableComponent
  ]
})
export class WindowsModule { }
