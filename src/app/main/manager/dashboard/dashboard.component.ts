import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'tg-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  
  constructor() { }

  ngOnInit() {
  }

}
