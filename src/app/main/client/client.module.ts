import { NgModule } from '@angular/core';
import { ClientComponent } from './client.component';
import { ClientRoutingModule } from './client-routing.module';
import { ClientContainerComponent } from './client-container/client-container.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HistoryService } from 'src/app/services/history.service';
import { RightSidebarModule } from './right-sidebar/right-sidebar.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OutputModule } from './output/output.module';
import { GameService } from 'src/app/services/game.service';
import { WindowsModule } from './windows/windows.module';
import { InputModule } from './input/input.module';
import { AudioComponent } from './audio/audio.component';

@NgModule({
  declarations: [
    ClientComponent,
    ClientContainerComponent,
    NavbarComponent,
    AudioComponent
  ],
  imports: [
    SharedModule,
    ClientRoutingModule,
    DashboardModule,
    RightSidebarModule,
    OutputModule,
    WindowsModule,
    InputModule
  ],
  exports: [
    ClientComponent,
  ],
  providers: [
    GameService,
    HistoryService,
  ],
})
export class ClientModule {
 }
