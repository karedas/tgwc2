import { Component, OnInit, ViewEncapsulation,  } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'tg-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  
  characters: Observable<any>;
  selectedTab: number = 1;

  // private _unsubscribeAll: Subject<any>;
  
  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.characters = this.userService.characters;
  }

  changeTab(index: number) {
      this.selectedTab = index;
  }

  // ngOnDestroy(): void {
  //   this._unsubscribeAll.next();
  //   this._unsubscribeAll.complete();
  // }


}
