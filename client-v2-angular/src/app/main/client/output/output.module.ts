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

@NgModule({
  declarations: [
    ObjpersDetailComponent,
    ObjPersContainerComponent,
    RoomComponent,
    TextComponent,
    OutputComponent,
    DetailsRoomComponent,
    ContextMenuComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AngularSplitModule.forRoot()
  ],
  exports: [
    OutputComponent
  ]
})
export class OutputModule { }
