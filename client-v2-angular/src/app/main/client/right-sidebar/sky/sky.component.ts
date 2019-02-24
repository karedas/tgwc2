import { Component, OnDestroy } from '@angular/core';
import { DataState } from 'src/app/store/state/data.state';
import { getSky } from 'src/app/store/selectors';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tg-sky',
  templateUrl: './sky.component.html',
  styleUrls: ['./sky.component.scss'],
})
export class SkyComponent implements OnDestroy {

  skyValue: string;
  private _unsubscribeAll: Subject<any>;

  constructor( private store: Store<DataState>) {

    this._unsubscribeAll = new Subject<any>();

    this.store.pipe(
      select(getSky),
      takeUntil(this._unsubscribeAll)
      ).subscribe(
      sky => {this.skyValue = sky; }
    );
    }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
