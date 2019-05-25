import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'signup',
        component: SignupComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      // {
      //   path: 'registrazione',
      //   loadChildren: './registration/registration.module#RegistrationModule',
      // },
      {
        path: '**',
        redirectTo: 'login'
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AuthRoutingModule { }
