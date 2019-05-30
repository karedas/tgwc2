import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from './client.component';

const clientRouting: Routes = [
  {
    path: '**',
    component: ClientComponent,
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(clientRouting)],
  exports: [RouterModule]
})

export class ClientRoutingModule { }
