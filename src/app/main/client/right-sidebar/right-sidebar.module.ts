import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkyComponent } from './sky/sky.component';
import { RightSidebarComponent } from './right-sidebar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeoLocationComponent } from './geo-location/geo-location.component';
import { MapModule } from './map/map.module';

@NgModule({
  declarations: [
    SkyComponent,
    RightSidebarComponent,
    GeoLocationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MapModule
  ],
  exports: [
    RightSidebarComponent
  ]
})
export class RightSidebarModule { }
