import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';



@Component({
  selector: 'tg-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit, OnDestroy{
  profile: Observable<any>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private dashboardService: UserService
  ) {
    this._unsubscribeAll = new Subject();
   }

  ngOnInit(): void {

    this.dashboardService.getProfile()
      .pipe( takeUntil(this._unsubscribeAll) )
      .subscribe((profile => {
        this.profile =  profile.user;
      }))
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
