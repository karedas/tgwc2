import { Component, AfterViewInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { items } from './navigation';

@Component({
  selector: 'tg-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent {

  menuItems = items;
  
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger
  
  constructor() {}


}