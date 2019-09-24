import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tg-window-wrapper',
  templateUrl: './window-wrapper.component.html',
  styleUrls: ['./window-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WindowWrapperComponent implements OnInit {
  @Input('hideTitle') hideTitle: boolean = false;
  constructor() { 
  }

  ngOnInit() {
  }
}
