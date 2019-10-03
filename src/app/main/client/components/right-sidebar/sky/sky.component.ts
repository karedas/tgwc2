import { Component, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getSky } from 'src/app/main/client/store/selectors';
import { DataState } from 'src/app/main/client/store/state/data.state';

@Component({
  selector: 'tg-sky',
  templateUrl: './sky.component.html',
  styleUrls: ['./sky.component.scss']
})
export class SkyComponent implements OnDestroy {
  skyValue: string;
  private _unsubscribeAll: Subject<any>;

  constructor(private store: Store<DataState>) {
    this._unsubscribeAll = new Subject<any>();

    this.store
      .pipe(
        select(getSky),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(sky => {
        this.skyValue = sky;
      });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
