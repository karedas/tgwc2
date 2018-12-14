import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tg-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor() {
    console.log('navbar');
   }

  ngOnInit() {
  }

}
