import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientContainerComponent } from './client-container/client-container.component';
import { AuthGuard } from '../authentication/services/login.guard';

const clientRouting: Routes = [
  {
    path: 'webclient',
    component: ClientContainerComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(clientRouting)],
  exports: [RouterModule]
})

export class ClientRoutingModule { }
