import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainNavigationModule } from '../../main-navigation/main-navigation.module';
import { GlobalNewsComponent } from './global-news.component';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '**',
    component: GlobalNewsComponent
  },
];


@NgModule({
  declarations: [
    GlobalNewsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    MainNavigationModule,
    CommonModule,
  ],
  exports: [
    GlobalNewsComponent
  ]
})
export class GlobalNewsModule { }
