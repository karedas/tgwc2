import { NgModule } from '@angular/core';
import { MyCharactersComponent } from './my-characters.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/services/auth.guard';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';

const routes: Routes = [
  {
    path: '**',
    component: MyCharactersComponent,
    canActivate: [AuthGuard],
  }
]

@NgModule({
  declarations: [MyCharactersComponent],
  imports: [
    RouterModule.forChild(routes),
    MatExpansionModule,
    MatFormFieldModule,
  ]
})
export class MyCharactersModule { }
