import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainNavigationComponent } from './main-navigation.component';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatBadgeModule, MatToolbarModule, MatListModule } from '@angular/material';
import { TgGameMenuComponent } from './game-menu/tg-game-menu.component';


@NgModule({
  declarations: [
    MainNavigationComponent,
    TgGameMenuComponent
  ],
  imports: [
    SharedModule,
    MatListModule,
    MatToolbarModule,
    MatBadgeModule,
    RouterModule,
    MatIconModule
  ],
  exports: [
    MainNavigationComponent
  ]
})
export class MainNavigationModule { }
