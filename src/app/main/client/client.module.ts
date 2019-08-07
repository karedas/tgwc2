import { NgModule } from '@angular/core';
import { ClientComponent } from './client.component';
import { FileSaverModule } from 'ngx-filesaver';
import { ClientContainerComponent } from './components/client-container/client-container.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RightSidebarModule } from './components/right-sidebar/right-sidebar.module';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { OutputModule } from './components/output/output.module';
import { InputModule } from './components/input/input.module';
import { AudioComponent } from './components/audio/audio.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginClientGuard } from '../authentication/services/login-client.guard';
import { DialogV2Module } from './common/dialog-v2/dialog-v2.module';
import { OutputService } from './components/output/output.service';
import { DialogV2Service } from './common/dialog-v2/dialog-v2.service';
import { EffectsModule } from '@ngrx/effects';
import { DataEffects } from './store/effects/data.effects';

const clientRouting: Routes = [
  {
    path: '**',
    component: ClientComponent,
    pathMatch: 'full',
    canActivate: [ LoginClientGuard ],
  }
];

@NgModule({
  declarations: [
    ClientComponent,
    ClientContainerComponent,
    AudioComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(clientRouting),
    EffectsModule.forFeature([DataEffects]),
    DashboardModule,
    RightSidebarModule,
    OutputModule,
    InputModule,
    DialogV2Module,
    FileSaverModule,
  ],
  exports: [
    ClientComponent,
  ],
  providers: [
    DialogV2Service,
    OutputService
  ]
})
export class ClientModule {
 }
