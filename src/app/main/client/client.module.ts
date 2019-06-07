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

import { JwSocialButtonsModule } from 'jw-angular-social-buttons';
import { IconsComponent } from './common/icons/icons.component';
import { HstatComponent } from './common/hstat/hstat.component';

@NgModule({
  declarations: [
    ClientComponent,
    ClientContainerComponent,
    AudioComponent,
    NavbarComponent,
    IconsComponent,
    HstatComponent,
  ],
  imports: [
    SharedModule,
    ClientRoutingModule,
    DashboardModule,
    RightSidebarModule,
    OutputModule,
    InputModule,
    FileSaverModule,
    JwSocialButtonsModule
  ],
  exports: [
    IconsComponent,
    NavbarComponent,
    ClientComponent
  ],
})
export class ClientModule {
 }
