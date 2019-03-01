import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { SkyComponent } from './sky/sky.component';
import { RightSidebarComponent } from './right-sidebar.component';
import { DirectionsComponent } from './map/directions/directions.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeoLocationComponent } from './geo-location/geo-location.component';

@NgModule({
  declarations: [
    MapComponent,
    SkyComponent,
    RightSidebarComponent,
    DirectionsComponent,
    GeoLocationComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    RightSidebarComponent
  ]
})
export class RightSidebarModule { }
