import { NgModule } from '@angular/core';
import { ManagerComponent } from './manager.component';
import { Routes, RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { NewCharacterModule } from './new-character/new-character.module';
import { SharedModule } from 'src/app/shared/shared.module';


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
        path: 'nuovo-personaggio',
        loadChildren: () => import('./new-character/new-character.module').then(m => m.NewCharacterModule)
      },
      // {
      //   path: 'administration',
      //   loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
      // },
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
    NewCharacterModule,
    SharedModule
  ],
})

export class ManagerModule { }
