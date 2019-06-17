import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { User } from 'src/app/core/models/user.model';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'tg-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy{

  userProfile: Subject<User>
  private _unsubscribeAll: Subject<any>;

  constructor(private dashboardService: DashboardService) {
    this._unsubscribeAll = new Subject();
   }

  ngOnInit(): void {
    this.dashboardService.aboutChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(( response: ApiResponse ) => { 
      this.userProfile = response.data;
      console.log(this.userProfile);
    })
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
