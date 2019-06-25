import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from 'src/app/core/services/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { MyCharactersComponent } from './my-characters/my-characters.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Role } from 'src/app/core/models/role';

const routes: Routes = [
  {
    path: '**',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Player] }
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    MyCharactersComponent
  ],
  imports: [
    MatExpansionModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class DashboardModule { }
