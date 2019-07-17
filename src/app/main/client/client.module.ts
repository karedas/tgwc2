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
import { GameService } from './services/game.service';
import { EffectsModule } from '@ngrx/effects';
import { ClientEffects } from 'src/app/store/effects/client.effects';
import { DataEffects } from 'src/app/store/effects/data.effects';
import { baseReducer, clearState } from 'src/app/store';
import { StoreModule } from '@ngrx/store';

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
    StoreModule.forFeature('client', 
      baseReducer, { metaReducers: [clearState] }
    ),
    // EffectsModule.forFeature([ClientEffects, DataEffects]),
    FileSaverModule,
  ],
  exports: [
    NavbarComponent,
    ClientComponent,
  ],
  providers: [
    GameService
  ]
})
export class ClientModule {
 }
