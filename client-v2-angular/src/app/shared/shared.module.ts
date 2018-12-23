import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,

  ],
  exports: [
    CommonModule,
  ]
})
export class SharedModule {
  static forRoot() {
    return {
        ngModule: SharedModule,
    };
  }
 }
