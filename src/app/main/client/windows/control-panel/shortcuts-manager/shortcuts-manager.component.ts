import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tg-shortcuts-manager',
  templateUrl: './shortcuts-manager.component.html',
  styleUrls: ['./shortcuts-manager.component.scss'],
})
export class ShortcutsManagerComponent implements OnInit {

  iconsListOpenedStatus: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  openIconsList() {
    this.iconsListOpenedStatus = !this.iconsListOpenedStatus;    
  }

}
