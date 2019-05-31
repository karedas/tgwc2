import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { AuthGuard } from 'src/app/core/services/auth.guard';
import { ProfileService } from './profile.service';

const routes: Routes = [
  {
    path: '**',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    resolve: {
      profile: ProfileService
    }
  }
];

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    RouterModule.forChild(routes)
  ],
  providers: [
    ProfileService
  ]
})
export class ProfileModule { }
