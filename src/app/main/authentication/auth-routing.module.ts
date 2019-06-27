import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { VerifyRegistrationComponent } from './verify-registration/verify-registration.component';
import { SignupConfirmComponent } from './signup-confirm/signup-confirm.component';
import { VcodeGuard } from './services/vcode.guard';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AnonymousGuard } from 'src/app/core/guards/anonymous.guard';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [AnonymousGuard],
    children: [
      {
        path: 'verify/:token',
        component: VerifyRegistrationComponent,
        canActivate: [VcodeGuard]
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
      {
        path: 'signup-confirm',
        component: SignupConfirmComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'reset',
        component: ForgotPasswordComponent,
      },
      {
        path: 'reset/:token',
        component: ResetPasswordComponent,
      },
      {
        path: '**',
        redirectTo: 'login'
      }
    ],
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
