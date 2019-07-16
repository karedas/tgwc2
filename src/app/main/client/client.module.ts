import { NgModule } from '@angular/core';
import { ClientComponent } from './client.component';
import { FileSaverModule } from 'ngx-filesaver';
import { ClientRoutingModule } from './client-routing.module';
import { ClientContainerComponent } from './components/client-container/client-container.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RightSidebarModule } from './components/right-sidebar/right-sidebar.module';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { OutputModule } from './components/output/output.module';
import { InputModule } from './components/input/input.module';
import { AudioComponent } from './components/audio/audio.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TgConfigModule } from 'src/app/shared/tgconfig.module';


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
    FileSaverModule,
    TgConfigModule
  ],
  exports: [
    NavbarComponent,
    ClientComponent,
  ],
})
export class ClientModule {
 }
