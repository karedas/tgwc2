import { NgModule } from '@angular/core';
import { ManagerComponent } from './manager.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthGuard } from 'src/app/core/services/auth.guard';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';



const routes: Routes = [
  {
    path: '',
    component: ManagerComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'administration',
        loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ]
  },
];

@NgModule({
  declarations: [
    ManagerComponent,
    FooterComponent,
    SidebarComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ]
})

export class ManagerModule { }
