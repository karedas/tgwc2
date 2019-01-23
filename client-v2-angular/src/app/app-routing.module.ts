import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './main/authentication/login/login.component';
import { RegistrationComponent } from './main/registration/registration.component';
import { AppPreloadingStrategy } from './app.preloading-strategy';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  { path: '**', redirectTo: 'login'}
];


@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false, // <-- debugging purposes only
        preloadingStrategy: AppPreloadingStrategy,
      }
    )
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }
