import { NgModule } from '@angular/core';
import { InputService } from './input.service';
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
