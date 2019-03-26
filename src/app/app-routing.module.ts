import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPreloadingStrategy } from './app.preloading-strategy';
import { LoginComponent } from './main/authentication/login/login.component';

const routes: Routes = [
  {path: '', redirectTo: '/auth/login', pathMatch: 'full'},
  {path: '**', redirectTo: '/'}
]
@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
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
