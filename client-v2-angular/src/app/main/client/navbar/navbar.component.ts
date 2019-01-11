import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { jqxMenuComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxmenu';
import { jqxWindowComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';

@Component({
  selector: 'tg-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {

  @ViewChild('tgMainMenu') mainMenu: jqxMenuComponent;

  settings: {};

  constructor() {
    this.settings = {
      animationShowDuration: 0,
      animationHideDuration: 0,
      animationShowDelay: 0,
      showTopLevelArrows: true
    };
  }

  ngAfterViewInit(): void {
    this.mainMenu.setOptions(this.settings);
  }
}
