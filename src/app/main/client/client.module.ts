import { NgModule } from '@angular/core';
import { ClientComponent } from './client.component';
import { FileSaverModule } from 'ngx-filesaver';
import { ClientRoutingModule } from './client-routing.module';
import { ClientContainerComponent } from './client-container/client-container.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RightSidebarModule } from './right-sidebar/right-sidebar.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OutputModule } from './output/output.module';
import { InputModule } from './input/input.module';
import { AudioComponent } from './audio/audio.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    ClientComponent,
    ClientContainerComponent,
    AudioComponent,
    NavbarComponent,
  ],
  imports: [
    SharedModule,
    ClientRoutingModule,
    DashboardModule,
    RightSidebarModule,
    OutputModule,
    InputModule,
    FileSaverModule
  ],
  exports: [
    NavbarComponent,
    ClientComponent
  ],
})
export class ClientModule {
 }
