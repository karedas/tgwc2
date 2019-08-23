import { NgModule } from '@angular/core';
import { DataToHtmlPipe } from './dataToHtml.pipe';
import { IconsPipe } from './icons.pipe';
import { GetEthnicityByCodePipe } from './get-ethnicity-by-code.pipe';
import { CapitalizeFirstPipe } from './capitalizeFirst.pipe';

@NgModule({
  declarations: [
    DataToHtmlPipe,
    IconsPipe,
    CapitalizeFirstPipe,
    GetEthnicityByCodePipe
  ],
  imports: [],
  exports: [
    IconsPipe,
    DataToHtmlPipe,
    CapitalizeFirstPipe,
    GetEthnicityByCodePipe
  ]
})
export class PipesModule { }
