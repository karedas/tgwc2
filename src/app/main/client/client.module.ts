import { NgModule } from '@angular/core';
import { ClientComponent } from './client.component';
import { ClientRoutingModule } from './client-routing.module';
import { ClientContainerComponent } from './client-container/client-container.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { AudioComponent } from './audio/audio.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HistoryService } from 'src/app/services/history.service';
import { WindowsModule } from './windows/windows.module';
import { RightSidebarModule } from './right-sidebar/right-sidebar.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OutputModule } from './output/output.module';
import { RouterModule } from '@angular/router';



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
    WindowsModule,
    OutputModule,
    SharedModule,
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
