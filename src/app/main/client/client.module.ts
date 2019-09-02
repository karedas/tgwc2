import { NgModule } from '@angular/core';
import { ClientComponent } from './client.component';
import { FileSaverModule } from 'ngx-filesaver';
import { SharedModule } from 'src/app/shared/shared.module';
import { RightSidebarModule } from './components/right-sidebar/right-sidebar.module';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { OutputModule } from './components/output/output.module';
import { InputModule } from './components/input/input.module';
import { AudioComponent } from './components/audio/audio.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginClientGuard } from '../authentication/services/login-client.guard';
import { OutputService } from './components/output/output.service';
import { EffectsModule } from '@ngrx/effects';
import { DataEffects } from './store/effects/data.effects';
import { DispenserService } from './services/dispenser.service';
import { StatusBarComponent } from './components/status-bar/status-bar.component';
import { AutofocusInputbarDirective } from 'src/app/shared/directives/autofocus-inputbar.directive';

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
    AudioComponent,
    StatusBarComponent,
    AutofocusInputbarDirective
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(clientRouting),
    EffectsModule.forFeature([DataEffects]),
    DashboardModule,
    RightSidebarModule,
    OutputModule,
    InputModule,
    FileSaverModule,
  ],
  exports: [
    ClientComponent,
  ],
  providers: [
    OutputService,
    DispenserService
  ]
})
export class ClientModule {
 }
