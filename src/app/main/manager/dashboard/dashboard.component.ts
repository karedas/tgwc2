import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tg-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  
  characters: Observable<any>;
  // private _unsubscribeAll: Subject<any>;
  
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.characters = this.userService.characters;
  }

  // ngOnDestroy(): void {
  //   this._unsubscribeAll.next();
  //   this._unsubscribeAll.complete();
  // }


}
