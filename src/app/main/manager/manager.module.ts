import { NgModule } from '@angular/core';
import { ManagerComponent } from './manager.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthGuard } from 'src/app/core/services/auth.guard';
import { AdministrationModule } from './administration/administration.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { AnonymousGuard } from 'src/app/core/services/anonymous.guard';



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
      // {
      //   path: 'profilo',
      //   loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
      // },
      // {
      //   path: 'personaggi',
      //   loadChildren: () => import('./my-characters/my-characters.module').then(m => m.MyCharactersModule)
      // },
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
  ]
})

export class ManagerModule { }
