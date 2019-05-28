import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { VerifyRegistrationComponent } from './verify-registration/verify-registration.component';
import { SignupConfirmComponent } from './signup-confirm/signup-confirm.component';
import { VcodeGuard } from './services/vcode.guard';

const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'verify/:token',
        component: VerifyRegistrationComponent,
        canActivate: [VcodeGuard]
      },
      {
        path: 'signup',
        component: SignupComponent
      },
      {
        path: 'signup-confirm',
        component: SignupConfirmComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
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
