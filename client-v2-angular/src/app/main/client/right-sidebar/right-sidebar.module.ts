import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { MonitorBoxComponent } from './monitor-box/monitor-box.component';
import { SkyComponent } from './sky/sky.component';
import { RightSidebarComponent } from './right-sidebar.component';
import { DirectionsComponent } from './map/directions/directions.component';

@NgModule({
  declarations: [
    MapComponent,
    MonitorBoxComponent,
    SkyComponent,
    RightSidebarComponent,
    DirectionsComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    RightSidebarComponent
  ]
})
export class RightSidebarModule { }
