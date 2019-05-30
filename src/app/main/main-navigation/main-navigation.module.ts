import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainNavigationComponent } from './main-navigation.component';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    MainNavigationComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    MatIconModule
  ],
  exports: [
    MainNavigationComponent
  ]
})
export class MainNavigationModule { }
