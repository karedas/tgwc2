import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { CookieLawComponent } from '../../client/windows/cookie-law/cookie-law.component';
import { CheckboxModule } from 'primeng/checkbox';
import { SharedModule } from 'src/app/shared/shared.module';
import { WelcomeNewsComponent } from './welcome-news/welcome-news.component';
import { CommandsListComponent } from './commands-list/commands-list.component';
import { DialogModule } from 'primeng/dialog';
import { DialogsComponent } from '../../common/dialog/dialog.component';

@NgModule({
  declarations: [
    // GenericTableComponent,
    // NoFeatureComponent,
    CommandsListComponent,
    WelcomeNewsComponent,
    CookieLawComponent,
    CommandsListComponent,
    DialogsComponent
  ],
  imports: [
    DynamicDialogModule,
    DialogModule,
    CommonModule,
    CheckboxModule,
    SharedModule
  ],
  exports: [
    CommandsListComponent
  ],
  entryComponents: [
    // GenericTableComponent,
    // NoFeatureComponent,
    CommandsListComponent,
    WelcomeNewsComponent,
    CookieLawComponent
  ],
})
export class WindowsModule { }
