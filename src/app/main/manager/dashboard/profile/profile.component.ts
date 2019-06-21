import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { User } from 'src/app/core/models/user.model';
import { DashboardService } from '../dashboard.service';



@Component({
  selector: 'tg-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy{

  profile: Observable<any>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private dashboardService: DashboardService
  ) {
    this._unsubscribeAll = new Subject();
   }

  ngOnInit(): void {

    this.dashboardService.getProfile()
      .pipe( takeUntil(this._unsubscribeAll) )
      .subscribe((profile => {
        this.profile =  profile;
      }))
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
