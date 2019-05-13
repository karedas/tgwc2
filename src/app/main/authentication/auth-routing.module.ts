import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from '../registration/registration.component';

const AUTH_ROUTES: Routes = [
  {
    path: 'auth',
    children: [
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
        component: RegistrationComponent
      },
    ]
  },


  // {
  //   path: 'registration',
  //   component: RegistrationComponent,
  //   pathMatch: 'full'
  // }
  // {path: 'auth/forgot-password', component: ForgotPasswordComponent},
  // {path: 'auth/reset-password', component: ResetPasswordComponent},
  // {path: 'auth/register', component: RegisterComponent},
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
