import { NgModule } from '@angular/core';
import { ManagerComponent } from './manager.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthGuard } from 'src/app/core/services/auth.guard';
import { AdministrationModule } from './administration/administration.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { FooterComponent } from './footer/footer.component';



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
        path: 'profilo',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'personaggi',
        loadChildren: () => import('./my-characters/my-characters.module').then(m => m.MyCharactersModule)
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
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MatExpansionModule,
    
  ],
  exports: [
    RouterModule,
    MatExpansionModule
  ]
})

export class ManagerModule { }
