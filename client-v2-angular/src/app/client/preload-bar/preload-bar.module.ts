import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloadBarComponent } from './preload-bar.component';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
  declarations: [
    PreloadBarComponent
  ],
  imports: [
    CommonModule,
    ProgressBarModule
  ],
  exports: [
    PreloadBarComponent
  ]
})
export class PreloadBarModule {  }