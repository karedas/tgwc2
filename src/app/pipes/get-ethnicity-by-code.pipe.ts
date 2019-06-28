
import { Pipe, PipeTransform } from '@angular/core';
import { ethnicity } from 'src/assets/data/ethnicity/ethnicity.const';

@Pipe({
  name: 'getEthnicityByCode',
  pure: true
})
export class GetEthnicityByCodePipe implements PipeTransform {

  ethnicities = ethnicity;

  transform(raceCode: any, ...args: any[]): any {
    let eths = this.ethnicities[raceCode];
    let msg = eths.filter((e) => {
      return e.code === args[0];
    });

    if(msg) {
      return msg[0].name;
    }
      
    return null;
  }

}
