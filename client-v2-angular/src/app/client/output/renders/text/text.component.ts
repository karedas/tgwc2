import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tg-text',
  templateUrl: './text.component.html',
  encapsulation: ViewEncapsulation.None
})



export class TextComponent   {
   @Input() html: any;

  constructor() {
  }


}
