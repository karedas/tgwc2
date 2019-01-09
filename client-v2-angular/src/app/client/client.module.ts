import { NgModule, } from '@angular/core';

import { CookieLawComponent } from './cookie-law/cookie-law.component';
import { ClientComponent } from './client.component';
import { ClientRoutingModule } from './client-routing.module';
import { ClientContainerComponent } from './client-container/client-container.component';
import { NavbarComponent } from './navbar/navbar.component';
import { OutputComponent } from './output/output.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InputComponent } from './dashboard/input/input.component';
import { CharacterPanelComponent } from './dashboard/character-panel/character-panel.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { SharedModule } from '../shared/shared.module';
import { MapComponent } from './map/map.component';
import { SkyComponent } from './sky/sky.component';
import { DirectionsComponent } from './map/directions/directions.component';
import { TextComponent } from './output/renders/text/text.component';
import { RoomComponent } from './output/renders/room/room.component';
import { IconsComponent } from './common/icons/icons.component';

// JQXWidgets
import { jqxWindowComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import { jqxSplitterComponent  } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';
import { jqxPanelComponent  } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxpanel';
import { SplashscreenComponent } from './splashscreen/splashscreen.component';
import { AudioComponent } from './audio/audio.component';



@NgModule({
  declarations: [
    ClientComponent,
    CookieLawComponent,
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
    IconsComponent,
    SplashscreenComponent,
    //jqx widgets
    jqxWindowComponent,
    jqxPanelComponent,
    jqxSplitterComponent,
    AudioComponent
  ],
  imports: [
    ClientRoutingModule,
    SharedModule,
    // PreloadBarModule
  ],
  exports: [
    ClientComponent
  ]
})
export class ClientModule {
 }
