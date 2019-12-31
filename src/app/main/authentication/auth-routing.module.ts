import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginCharacterComponent } from './login-character/login-character.component';

const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login-character',
        component: LoginCharacterComponent,
      },
      {
        path: '',
        redirectTo: 'login-character',
        pathMatch: 'full'
      }
    ]
  },

];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ]
})

export class AuthRoutingModule { }
