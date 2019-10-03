import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quantitySort'
})
export class QuantitySortPipe implements PipeTransform {

  transform(list: any, key?: string , ...args: any[]): any {
    let orderedList: any;
    return list;
    orderedList = list.slice().sort((a, b) => {
      if(a[key].length > b[key].length && a['condprc'] ) {
        return -1;
      } 
      if(a[key].length < b[key].length) {
        return 1;
      }
      return 0;
    });
    return orderedList ? orderedList : list;
  }

}
