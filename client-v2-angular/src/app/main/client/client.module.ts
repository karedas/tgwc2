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
import { TextComponent } from './output/renders/text/text.component';
import { RoomComponent } from './output/renders/room/room.component';
import { IconsComponent } from './common/icons/icons.component';

// JQXWidgets
import { jqxSplitterComponent  } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';
import { SplashscreenComponent } from './splashscreen/splashscreen.component';
import { AudioComponent } from './audio/audio.component';
import { ExtraboardComponent } from './dashboard/extraboard/extraboard.component';
import { jqxMenuComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxmenu';
import { SharedModule } from 'src/app/shared/shared.module';
import { WelcomeNewsComponent } from './welcome-news/welcome-news.component';
import { HistoryService } from 'src/app/services/history.service';
import { CombatPanelComponent } from './dashboard/combat-panel/combat-panel.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { MapComponent } from './right-sidebar/map/map.component';
import { SkyComponent } from './right-sidebar/sky/sky.component';
import { DirectionsComponent } from './right-sidebar/map/directions/directions.component';
import { MonitorBoxComponent } from './right-sidebar/monitor-box/monitor-box.component';
import { DetailsRoomComponent } from './output/renders/details-room/details-room.component';
import { RegistrationComponent } from '../registration/registration.component';
import { DialogModule } from '../common/dialog/dialog.module';
import { DialogComponent } from '../common/dialog/dialog.component';
import { LoginSmartComponent } from './login-smart/login-smart.component';

@NgModule({
  declarations: [
    // jqx widgets
    jqxSplitterComponent,
    jqxMenuComponent,
    // Client Components
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
    AudioComponent,
    ExtraboardComponent,
    CombatPanelComponent,
    RightSidebarComponent,
    MonitorBoxComponent,
    DetailsRoomComponent,
    RegistrationComponent,
    WelcomeNewsComponent,
    LoginSmartComponent,
  ],
  imports: [
    ClientRoutingModule,
    DialogModule,
    SharedModule,
  ],
  exports: [
    ClientComponent,
  ],
  providers: [
    HistoryService
  ],
  entryComponents: [
    WelcomeNewsComponent
  ]
})
export class ClientModule {
 }
