import { Component,  OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ethnicity } from 'src/assets/data/ethnicity/ethnicity.const';


@Component({
  selector: 'tg-characters-list',
  templateUrl: './tg-characters-list.component.html',
  styleUrls: ['./tg-characters-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyCharactersComponent implements OnInit{

  @Input('chars') chars: any[];


  readonly env = environment;
  readonly maxCharacter: number;
  readonly ethnicity = ethnicity;
  enabledCharactersNumber: number;
  
  constructor() {
    this.maxCharacter = 2;
  }
  
  ngOnInit(): void {
    this.enabledCharactersNumber =  this.getTotalEnabledChars(this.chars);    
  }
  

  private getTotalEnabledChars(chars: any): number {
    let count = 0;
    for(let i = 0; i < chars.length; ++i){
      if(chars[i].status === 1)
        count++;
    }
    return count;
  }

}
