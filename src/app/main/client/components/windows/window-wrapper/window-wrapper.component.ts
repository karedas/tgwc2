import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tg-window-wrapper',
  templateUrl: './window-wrapper.component.html',
  encapsulation: ViewEncapsulation.None
})
export class WindowWrapperComponent implements OnInit {
  @Input('hideTitle') hideTitle: boolean;
  @Input('border') border: string;
  @Input('nopadding') nopadding: boolean;
  @Input('noclose') noclose: boolean;
  constructor() {
  }

  ngOnInit() {
  }
}
