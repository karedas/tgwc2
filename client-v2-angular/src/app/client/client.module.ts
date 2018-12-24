import { NgModule, } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';

import { CookieLawComponent } from './cookie-law/cookie-law.component';
import { ClientComponent } from './client.component';
import { DialogModule } from 'primeng/dialog';
import { ClientRoutingModule } from './client-routing.module';
import { Auth2Module } from '../authentication/auth.module';
import { ClientContainerComponent } from './client-container/client-container.component';
import { NavbarComponent } from './navbar/navbar.component';
import { OutputComponent } from './output/output.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InputComponent } from './dashboard/input/input.component';
import { CharacterPanelComponent } from './dashboard/character-panel/character-panel.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { SharedModule } from '../shared/shared.module';
import { MapComponent } from './map/map.component';
import { SkyComponent } from './sky/sky.component';

@NgModule({
  declarations: [
    ClientComponent,
    CookieLawComponent,
    ClientContainerComponent,
    NavbarComponent,
    OutputComponent,
    DashboardComponent,
    InputComponent,
    CharacterPanelComponent,
    ControlPanelComponent,
    MapComponent,
    SkyComponent,
  ],
  imports: [
    ClientRoutingModule,
    Auth2Module,
    BrowserModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    ClientComponent
  ]
})
export class ClientModule {
 }
