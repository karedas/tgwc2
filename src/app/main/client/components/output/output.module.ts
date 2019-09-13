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
import { SmartEquipInventoryComponent } from './smart-equip-inventory/smart-equip-inventory.component';
import { HeroInventoryModule } from '../hero-inventory/hero-inventory.module';
import { HeroEquipmentModule } from '../hero-equipment/hero-equipment.module';
@NgModule({
  declarations: [
    OutputComponent,
    ObjpersDetailComponent,
    ObjPersContainerComponent,
    RoomComponent,
    TextComponent,
    DetailsRoomComponent,
    ContextMenuComponent,
    GenericPageComponent,
    StatusComponent,
    SmartEquipInventoryComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AngularSplitModule,
    HeroInventoryModule,
    HeroEquipmentModule
  ],
  exports: [
    OutputComponent
  ]
})
export class OutputModule { }
