import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'tg-extraboard',
  templateUrl: './extraboard.component.html',
  styleUrls: ['./extraboard.component.scss'],
})
export class ExtraboardComponent implements OnInit {

  @ViewChild('#shortcutOpen') shortcutLink: ElementRef;

  constructor() { }

  ngOnInit() {

  }

}
