import { NgModule } from '@angular/core';
import { DataToHtmlPipe } from './dataToHtml.pipe';
import { IconsPipe } from './icons.pipe';

@NgModule({
  declarations: [
    DataToHtmlPipe,
    IconsPipe,
  ],
  imports: [],
  exports: [
    IconsPipe,
    DataToHtmlPipe
  ]
})
export class PipesModule { }
