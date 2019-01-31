import { NgModule } from '@angular/core';

import { ClientComponent } from './client.component';
import { ClientRoutingModule } from './client-routing.module';
import { ClientContainerComponent } from './client-container/client-container.component';
import { NavbarComponent } from './navbar/navbar.component';
import { OutputComponent } from './output/output.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InputComponent } from './dashboard/input/input.component';
import { CharacterPanelComponent } from './dashboard/character-panel/character-panel.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { TextComponent } from './output/renders/text/text.component';
import { RoomComponent } from './output/renders/room/room.component';

// JQXWidgets

import { SplashscreenComponent } from './splashscreen/splashscreen.component';
import { AudioComponent } from './audio/audio.component';
import { ExtraboardComponent } from './dashboard/extraboard/extraboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HistoryService } from 'src/app/services/history.service';
import { CombatPanelComponent } from './dashboard/combat-panel/combat-panel.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { MapComponent } from './right-sidebar/map/map.component';
import { SkyComponent } from './right-sidebar/sky/sky.component';
import { DirectionsComponent } from './right-sidebar/map/directions/directions.component';
import { MonitorBoxComponent } from './right-sidebar/monitor-box/monitor-box.component';
import { DetailsRoomComponent } from './output/renders/details-room/details-room.component';
import { GeolocalBoxComponent } from './dashboard/extraboard/geolocal-box/geolocal-box.component';
import { WindowsModule } from './windows/windows.module';
import { ObjpersDetailComponent } from './output/renders/objpers-detail/objpers-detail.component';
import { ObjPersContainerComponent } from './output/renders/obj-pers-container/obj-pers-container.component';
import { StatusComponent } from './output/renders/status/status.component';
import { AngularSplitModule } from 'angular-split';

@NgModule({
  declarations: [
    // jqx widgets
    // Client Components
    ClientComponent,
    ClientContainerComponent,
    NavbarComponent,
    OutputComponent,
    DashboardComponent,
    InputComponent,
    CharacterPanelComponent,
    ControlPanelComponent,
    MapComponent,
    SkyComponent,
    DirectionsComponent,
    TextComponent,
    RoomComponent,
    SplashscreenComponent,
    AudioComponent,
    ExtraboardComponent,
    CombatPanelComponent,
    RightSidebarComponent,
    MonitorBoxComponent,
    DetailsRoomComponent,
    GeolocalBoxComponent,
    ObjpersDetailComponent,
    ObjPersContainerComponent,
    StatusComponent,
  ],
  imports: [
    ClientRoutingModule,
    WindowsModule,
    SharedModule,
    AngularSplitModule.forRoot()
  ],
  exports: [
    ClientComponent,
  ],
  providers: [
    HistoryService
  ],
})
export class ClientModule {
 }
