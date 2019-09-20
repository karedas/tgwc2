import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alphabeticalOrder'
})
export class AlphabeticalOrderPipe implements PipeTransform {
  /**
   *
   * @param list Object or Persons list
   * @param key subkey to check for order
   * @param args
   */
  transform(list: any, key: string, multiple?: boolean, ...args: any[]): any {
    let orderedList;
    orderedList = list.slice().sort((a, b) => {
      // && a['mrn'].length <= b['mrn'].length
      if (a[key] < b[key]) {
        return -1;
      }
      if (a[key] > b[key]) {
        return 1;
      }
      return 0;
    });
    return orderedList ? orderedList : list;
  }
}
