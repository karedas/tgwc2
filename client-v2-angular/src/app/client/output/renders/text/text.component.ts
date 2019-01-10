import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tg-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})



export class TextComponent   {
   @Input() html: any;

  constructor() { 
  }


}
