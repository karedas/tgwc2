import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginCharacterComponent } from './login-character/login-character.component';


@NgModule({
  declarations: [
    LoginCharacterComponent,
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    FlexLayoutModule,
  ],
  exports: [
  ]
})
export class Auth2Module { }
