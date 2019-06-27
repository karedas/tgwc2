import { NgModule } from '@angular/core';
import { AdministrationComponent } from './administration.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { Role } from 'src/app/core/models/role';

const routes: Routes = [
    {
      path: '**',
      component: AdministrationComponent,
      canActivate: [AuthGuard],
      data: {roles: [Role.Administrator] }
    }
  ]

@NgModule({
  declarations: [
    AdministrationComponent
  ],
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class AdministrationModule { }
