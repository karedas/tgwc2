import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPreloadingStrategy } from './app.preloading-strategy';
import { PageNotFoundComponent } from './main/pages/errors/404/page-not-found.component';

const routes: Routes = [
  { path: '**', redirectTo: 'auth/login-character' }
];

@NgModule({
  declarations: [
    PageNotFoundComponent
  ],
  imports: [
    RouterModule.forRoot(
      routes,
      {
        enableTracing: false,
        preloadingStrategy: AppPreloadingStrategy,
      }
    )
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }
