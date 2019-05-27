import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from './services/map.service';
import { MapSnowService } from './services/map-snow.service';
import { MapComponent } from './map.component';
import { DirectionsComponent } from './directions/directions.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    MapComponent,
    DirectionsComponent
  ],
  imports: [
    SharedModule,
    CommonModule
  ],
  exports: [
    MapComponent
  ],
  providers: [
    MapService,
    MapSnowService
  ]
})
export class MapModule { }
