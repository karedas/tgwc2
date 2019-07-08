import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainNavigationComponent } from './main-navigation.component';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatBadgeModule, MatToolbarModule } from '@angular/material';

@NgModule({
  declarations: [
    MainNavigationComponent
  ],
  imports: [
    SharedModule,
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
