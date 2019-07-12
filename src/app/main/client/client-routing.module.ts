import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from './client.component';
import { LoginClientGuard } from '../authentication/services/login-client.guard';

const clientRouting: Routes = [
  {
    path: '**',
    component: ClientComponent,
    pathMatch: 'full',
    canLoad: [ LoginClientGuard ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(clientRouting)
  ],
  exports: [RouterModule]
})

export class ClientRoutingModule { }
