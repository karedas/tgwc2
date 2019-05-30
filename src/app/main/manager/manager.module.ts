import { NgModule } from '@angular/core';
import { ManagerComponent } from './manager.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthGuard } from 'src/app/core/services/auth.guard';



const routes: Routes = [
  {
    path: '',
    component: ManagerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)

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
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [
    RouterModule
  ]
})

export class ManagerModule { }
