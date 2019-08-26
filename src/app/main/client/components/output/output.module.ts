import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjpersDetailComponent } from './renders/objpers-detail/objpers-detail.component';
import { ObjPersContainerComponent } from './renders/objpers-container/objpers-container.component';
import { RoomComponent } from './renders/room/room.component';
import { TextComponent } from './renders/text/text.component';
import { OutputComponent } from './output.component';
import { DetailsRoomComponent } from './renders/details-room/details-room.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularSplitModule } from 'angular-split';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { GenericPageComponent } from './renders/generic-page/generic-page.component';
import { StatusComponent } from './status/status.component';
import { StatusBarComponent } from '../status-bar/status-bar.component';
@NgModule({
  declarations: [
    ObjpersDetailComponent,
    ObjPersContainerComponent,
    RoomComponent,
    TextComponent,
    OutputComponent,
    DetailsRoomComponent,
    ContextMenuComponent,
    GenericPageComponent,
    StatusComponent,
    StatusBarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AngularSplitModule
  ],
  exports: [
    OutputComponent
  ]
})
export class OutputModule { }
