import { Component, AfterViewInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';

@Component({
  selector: 'tg-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger
  
  constructor() {}


}