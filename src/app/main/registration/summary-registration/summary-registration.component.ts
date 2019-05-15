import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tg-summary-registration',
  templateUrl: './summary-registration.component.html',
  styleUrls: ['./summary-registration.component.scss']
})
export class SummaryRegistrationComponent implements OnInit, OnDestroy{

  name: string;
  race: string;
  start: string;
  
  private _unsubscribeAll: Subject<any>;
  
  constructor(private route: ActivatedRoute) {
    this._unsubscribeAll = new Subject();
   }

  ngOnInit() {  
    this.route.queryParams
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        this.name =  params.name;
        this.race = params.race;
        this.start = params.start;
      })
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();

  }
}