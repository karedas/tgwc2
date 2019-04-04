import { NgModule } from '@angular/core';
import { ClientComponent } from './client.component';
import { ClientRoutingModule } from './client-routing.module';
import { ClientContainerComponent } from './client-container/client-container.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HistoryService } from 'src/app/main/client/services/history.service';
import { RightSidebarModule } from './right-sidebar/right-sidebar.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OutputModule } from './output/output.module';
import { GameService } from 'src/app/main/client/services/game.service';
import { InputModule } from './input/input.module';
import { AudioComponent } from './audio/audio.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    ClientComponent,
    ClientContainerComponent,
    AudioComponent,
    NavbarComponent
  ],
  imports: [
    SharedModule,
    ClientRoutingModule,
    DashboardModule,
    RightSidebarModule,
    OutputModule,
    InputModule
  ],
  exports: [
    NavbarComponent,
    ClientComponent
  ],
  providers: [
    GameService,
    HistoryService,
  ],
})
export class ClientModule {
 }
