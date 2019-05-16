import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPreloadingStrategy } from './app.preloading-strategy';
import { AuthGuard } from './main/authentication/services/login.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'webclient',
    loadChildren: './main/client/client.module#ClientModule',
    canLoad: [ AuthGuard ]
  },
  { 
    path: '**',
    redirectTo: 'auth'
  }
];
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
