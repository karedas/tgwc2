import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPreloadingStrategy } from './app.preloading-strategy';
import { LoginComponent } from './main/authentication/login/login.component';
import { PageNotFoundComponent } from './main/pages/page-not-found/page-not-found.component';
// import { LoginComponent } from './main/authentication/login/login.component';
// import { ManagerComponent } from './main/manager/manager.component';
// import { AuthGuard } from './main/authentication/services/login.guard';
// import { GlobalNewsComponent } from './main/pages/global-news/global-news.component';

const routes: Routes = [
  { path: '', redirectTo: 'manager', pathMatch: 'full' },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];


@NgModule({
  declarations: [
    PageNotFoundComponent
  ],
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
