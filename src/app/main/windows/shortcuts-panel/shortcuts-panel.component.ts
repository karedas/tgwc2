import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tg-shortcuts-panel',
  templateUrl: './shortcuts-panel.component.html',
  styleUrls: ['./shortcuts-panel.component.scss']
})
export class ShortcutsPanelComponent implements OnInit {


  totalShortcuts: Array<number> = new Array(20);


  constructor() { }

  ngOnInit() {
  }

}
