import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tg-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements AfterViewInit {

  // @ViewChild('tgMainMenu') mainMenu: jqxMenuComponent;

  constructor() {

  }

  ngAfterViewInit(): void {
    // this.mainMenu.setOptions(this.settings);
  }
}
