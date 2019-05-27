import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tg-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss']
})
export class MainNavigationComponent implements OnInit {
  @Input('active') active: string;
  gameTime: string;

  constructor(
  ) { }

  ngOnInit() {
  }

}
