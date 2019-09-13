import { NgModule } from '@angular/core';
import { HeroInventoryComponent } from './hero-inventory.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    HeroInventoryComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    HeroInventoryComponent
  ]
})
export class HeroInventoryModule { }
