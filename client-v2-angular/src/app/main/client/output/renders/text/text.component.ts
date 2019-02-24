import { Component, Input, ViewEncapsulation, OnDestroy } from '@angular/core';

@Component({
  selector: 'tg-text',
  templateUrl: './text.component.html',
})



export class TextComponent   {
    @Input() html: any;

  constructor() {
  }
}
