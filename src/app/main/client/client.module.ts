import { NgModule } from '@angular/core';
import { ClientComponent } from './client.component';
import { ClientRoutingModule } from './client-routing.module';
import { ClientContainerComponent } from './client-container/client-container.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AudioComponent } from './audio/audio.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HistoryService } from 'src/app/services/history.service';
import { RightSidebarModule } from './right-sidebar/right-sidebar.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OutputModule } from './output/output.module';
import { GameService } from 'src/app/services/game.service';
import { AudioService } from './audio/audio.service';
import { WindowsModule } from './windows/windows.module';
import { ConfigService } from 'src/app/services/config.service';
import { TgConfigModule } from 'src/app/shared/tgconfig.module';
import { tgConfig } from './client-config';

@NgModule({
  declarations: [
    ClientComponent,
    ClientContainerComponent,
    NavbarComponent,
    AudioComponent,
  ],
  imports: [
    ClientRoutingModule,
    DashboardModule,
    RightSidebarModule,
    OutputModule,
    SharedModule,
    WindowsModule,
    TgConfigModule.forChild(tgConfig)
  ],
  exports: [
    ClientComponent,
  ],
  providers: [
    ConfigService,
    AudioService,
    GameService,
    HistoryService,
  ],
})
export class ClientModule {
 }
