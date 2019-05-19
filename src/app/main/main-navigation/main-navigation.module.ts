import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainNavigationComponent } from './main-navigation.component';
import { RouterModule, Routes } from '@angular/router';

@NgModule({
  declarations: [
    MainNavigationComponent
  ],
  imports: [
    RouterModule,
    CommonModule
  ],
  exports: [
    MainNavigationComponent
  ]
})
export class MainNavigationModule { }
