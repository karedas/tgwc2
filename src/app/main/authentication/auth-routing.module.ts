import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';

const AUTH_ROUTES: Routes = [
  {
    path: 'auth',
    children: [

      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'registrazione',
        loadChildren: '../registration/registration.module#RegistrationModule',
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(AUTH_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})

export class AuthRoutingModule { }
