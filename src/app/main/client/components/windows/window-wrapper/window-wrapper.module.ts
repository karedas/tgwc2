import { NgModule } from '@angular/core';
import { WindowWrapperComponent } from './window-wrapper.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [
    WindowWrapperComponent
  ],
  imports: [
    SharedModule,
    DragDropModule
  ],
  exports: [
    WindowWrapperComponent
  ]
})
export class WindowWrapperModule { }
