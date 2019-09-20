import { NgModule } from '@angular/core';
import { DataToHtmlPipe } from './dataToHtml.pipe';
import { IconsPipe } from './icons.pipe';
import { GetEthnicityByCodePipe } from './get-ethnicity-by-code.pipe';
import { CapitalizeFirstPipe } from './capitalizeFirst.pipe';
import { AlphabeticalOrderPipe } from './alphabetical-order.pipe';
import { QuantitySortPipe } from './quantity-sort.pipe';

@NgModule({
  declarations: [
    DataToHtmlPipe,
    IconsPipe,
    CapitalizeFirstPipe,
    GetEthnicityByCodePipe,
    AlphabeticalOrderPipe,
    QuantitySortPipe,
  ],
  imports: [],
  exports: [
    IconsPipe,
    DataToHtmlPipe,
    CapitalizeFirstPipe,
    GetEthnicityByCodePipe,
    AlphabeticalOrderPipe,
    QuantitySortPipe
  ]
})
export class PipesModule { }
