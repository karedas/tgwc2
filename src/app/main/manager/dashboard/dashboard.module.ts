import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { MyCharactersComponent } from './characters-list/tg-characters-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Role } from 'src/app/core/models/role';
import { MatTableModule, MatTabsModule } from '@angular/material';
import { CharactersManageComponent } from './characters-manage/characters-manage.component';

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
    MyCharactersComponent,
    CharactersManageComponent
  ],
  imports: [
    MatExpansionModule,
    FlexLayoutModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTabsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class DashboardModule { }
