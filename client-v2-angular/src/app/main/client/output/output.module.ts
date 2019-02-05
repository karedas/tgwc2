import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjpersDetailComponent } from './renders/objpers-detail/objpers-detail.component';
import { ObjPersContainerComponent } from './renders/obj-pers-container/obj-pers-container.component';
import { RoomComponent } from './renders/room/room.component';
import { TextComponent } from './renders/text/text.component';
import { OutputComponent } from './output.component';
import { DetailsRoomComponent } from './renders/details-room/details-room.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularSplitModule } from 'angular-split';

@NgModule({
  declarations: [
    ObjpersDetailComponent,
    ObjPersContainerComponent,
    RoomComponent,
    TextComponent,
    OutputComponent,
    DetailsRoomComponent
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
