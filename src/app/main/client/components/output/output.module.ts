import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjpersDetailComponent } from './renders/objpers-detail/objpers-detail.component';
import { ObjPersContainerComponent } from './renders/objpers-container/objpers-container.component';
import { RoomComponent } from './renders/room/room.component';
import { TextComponent } from './renders/text/text.component';
import { OutputComponent } from './output.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularSplitModule } from 'angular-split';
import { GenericPageComponent } from './renders/generic-page/generic-page.component';
import { StatusComponent } from './status/status.component';
import { SmartEquipInventoryComponent } from './smart-equip-inventory/smart-equip-inventory.component';
import { HeroInventoryModule } from '../hero-inventory/hero-inventory.module';
import { HeroEquipmentModule } from '../hero-equipment/hero-equipment.module';
import { RoomObjectsListComponent } from './renders/room-objects-list/room-objects-list.component';
import { RoomPersonsListComponent } from './renders/room-persons-list/room-persons-list.component';
@NgModule({
  declarations: [
    OutputComponent,
    ObjpersDetailComponent,
    ObjPersContainerComponent,
    RoomComponent,
    TextComponent,
    GenericPageComponent,
    StatusComponent,
    SmartEquipInventoryComponent,
    RoomObjectsListComponent,
    RoomPersonsListComponent,
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
