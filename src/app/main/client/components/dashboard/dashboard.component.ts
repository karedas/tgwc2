import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tg-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [`
    :host {
      margin-top: auto;
      order: 3;
    }
    :host(.top) {
      order: 1;
      margin-bottom: 4px;
    }
    `]
})


export class DashboardComponent implements OnInit {
  constructor() {}
  ngOnInit() {
  }
}
