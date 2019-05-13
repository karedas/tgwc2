import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../authentication/services/login.guard';
import { ClientComponent } from './client.component';

const clientRouting: Routes = [
  {
    path: '',
    component: ClientComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(clientRouting)],
  exports: [RouterModule]
})

export class ClientRoutingModule { }
