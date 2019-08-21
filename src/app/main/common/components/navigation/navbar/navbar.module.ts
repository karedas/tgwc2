import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatBadgeModule, MatToolbarModule, MatListModule } from '@angular/material';
import { NavBarComponent } from './navbar.component';
import { TgGameItemsComponent } from './game-items/game-itemscomponent';


@NgModule({
  declarations: [
    NavBarComponent,
    TgGameItemsComponent
  ],
  imports: [
    SharedModule,
    MatListModule,
    MatToolbarModule,
    MatBadgeModule,
    RouterModule,
    MatIconModule
  ],
  exports: [
    NavBarComponent
  ]
})
export class NavBarModule { }
