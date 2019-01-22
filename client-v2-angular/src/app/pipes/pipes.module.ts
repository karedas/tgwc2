import { NgModule } from '@angular/core';
import { DataToHtmlPipe } from './dataToHtml.pipe';
import { IconsPipe } from './icons.pipe';
import { CapitalizeFirstPipe } from './capitalizeFirst';

@NgModule({
  declarations: [
    DataToHtmlPipe,
    IconsPipe,
    CapitalizeFirstPipe
  ],
  imports: [],
  exports: [
    IconsPipe,
    DataToHtmlPipe,
    CapitalizeFirstPipe
  ]
})
export class PipesModule { }
