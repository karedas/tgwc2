import { Component,  OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ethnicity } from 'src/assets/data/ethnicity/ethnicity.const';


@Component({
  selector: 'tg-characters-list',
  templateUrl: './tg-characters-list.component.html',
  styleUrls: ['./tg-characters-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyCharactersComponent implements OnInit{

  @Output() goToManage = new EventEmitter();
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
  
    if (!chars) 
      return;
  
  
    let count = 0;
    for(let i = 0; i < chars.length; ++i){
      if(chars[i].status === 1)
        count++;
    }
    return count;
  }

  goToChractersManage(event) {
    this.goToManage.emit();
  }
}
