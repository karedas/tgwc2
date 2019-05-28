import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tg-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss']
})
export class MainNavigationComponent implements OnInit {

  @Input('active') active: string;
  public hamburgerStatus: boolean = false;


  constructor(
  ) { }

  ngOnInit() {
  }

  onHamburgerClick() {
    this.hamburgerStatus = !this.hamburgerStatus;
  }

}
