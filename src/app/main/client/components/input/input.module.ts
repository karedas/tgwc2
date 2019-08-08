import { NgModule } from '@angular/core';
import { InputComponent } from './input.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    InputComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    InputComponent
  ]
})
export class InputModule { }
