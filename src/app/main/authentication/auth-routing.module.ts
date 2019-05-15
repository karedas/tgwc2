import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationService } from '../registration/services/registration.service';

const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registrazione',
    loadChildren: '../registration/registration.module#RegistrationModule',
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(AUTH_ROUTES)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    RegistrationService
  ]
})

export class AuthRoutingModule { }
