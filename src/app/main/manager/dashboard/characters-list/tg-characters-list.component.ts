import { Component, ViewEncapsulation, Input, Output, EventEmitter, SimpleChange, OnChanges, SimpleChanges, ComponentFactoryResolver } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ethnicity } from 'src/assets/data/ethnicity/ethnicity.const';


@Component({
  selector: 'tg-characters-list',
  templateUrl: './tg-characters-list.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MyCharactersComponent implements OnChanges{

  @Output() goToManage = new EventEmitter();
  @Input() chars: any[];

  readonly env = environment;
  readonly ethnicity = ethnicity;
  readonly maxCharacter: number;

  charsList: any;
  enabledCharactersNumber: number;


  ngOnChanges(changes: SimpleChanges) {
    const chars: SimpleChange = changes.chars;
    if(chars.currentValue) {
      // Get Only the enabled chars
      this.charsList = chars.currentValue.filter(this.isEnabled);
    }
  }

  isEnabled(value) {
    return value.status === 1;
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
