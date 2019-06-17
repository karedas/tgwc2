import { NgModule } from '@angular/core';
import { AdministrationComponent } from './administration.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/services/auth.guard';

const routes: Routes = [
    {
      path: '**',
      component: AdministrationComponent,
      // canActivate: [AuthGuard],
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
