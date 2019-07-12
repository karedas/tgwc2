import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { takeUntil } from 'rxjs/operators';



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
    private userService: UserService,
  ) {
    this._unsubscribeAll = new Subject();
   }

  ngOnInit(): void {
    this.profile = this.userService.getProfile()
    // this.profile = this.userService.getProfile()
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
