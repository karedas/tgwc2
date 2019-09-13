import { NgModule } from '@angular/core';
import { HeroEquipmentComponent } from './hero-equipment.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    HeroEquipmentComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    HeroEquipmentComponent
  ]
})
export class HeroEquipmentModule { }
