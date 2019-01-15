import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tg-extraboard',
  templateUrl: './extraboard.component.html',
  styleUrls: ['./extraboard.component.scss'],
})
export class ExtraboardComponent implements OnInit {

  shortcutsNumber = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];
  shortcuts = Array;

  constructor() { }

  ngOnInit() {

  }

}
