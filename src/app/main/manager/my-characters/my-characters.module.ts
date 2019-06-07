import { NgModule } from '@angular/core';
import { MyCharactersComponent } from './my-characters.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/services/auth.guard';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MyCharactersService } from './my-characters.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '**',
    component: MyCharactersComponent,
    canActivate: [AuthGuard],
    resolve: {
      profile: MyCharactersService
    }
  }
]

@NgModule({
  declarations: [
    MyCharactersComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    MatExpansionModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    SharedModule
  ],
  providers: [
    MyCharactersService
  ]
})
export class MyCharactersModule { }
