import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'tg-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss']
})
export class MainNavigationComponent implements OnInit {
  @Input('active') active: string;
  gameTime: string;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.getGameTime();
  }


  getGameTime() {
    this.apiService.getGameTime()
    .subscribe((data) => this.gameTime = data.time );
  }
}
