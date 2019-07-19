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
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginClientGuard } from '../authentication/services/login-client.guard';
import { EffectsModule } from '@ngrx/effects';
import { ClientEffects } from 'src/app/main/client/store/effects/client.effects';
import { DataEffects } from 'src/app/main/client/store/effects/data.effects';
import { baseReducer, clearState } from 'src/app/main/client/store';
import { StoreModule } from '@ngrx/store';
import { DialogV2Service } from './common/dialog-v2/dialog-v2.service';
import { DialogV2Module } from './common/dialog-v2/dialog-v2.module';
import { OutputService } from './components/output/output.service';

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
    NavbarComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(clientRouting),
    DashboardModule,
    RightSidebarModule,
    OutputModule,
    InputModule,
    StoreModule.forFeature('TG', 
      baseReducer, { metaReducers: [clearState] }
    ),
    EffectsModule.forFeature([ClientEffects, DataEffects]),
    DialogV2Module,
    FileSaverModule,
  ],
  exports: [
    NavbarComponent,
    ClientComponent,
  ],
  providers: [
    DialogV2Service,
    OutputService
  ]
})
export class ClientModule {
 }
