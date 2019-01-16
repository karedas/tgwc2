import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from '../registration/registration.component';

const authRoutes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent
  },
  {
    path: 'registration', 
    component: RegistrationComponent,
    pathMatch: 'full'
  }
  // {path: 'auth/forgot-password', component: ForgotPasswordComponent},
  // {path: 'auth/reset-password', component: ResetPasswordComponent},
  // {path: 'auth/register', component: RegisterComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AuthRoutingModule { }