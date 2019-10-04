import { Component, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getSky } from 'src/app/main/client/store/selectors';
import { DataState } from 'src/app/main/client/store/state/data.state';
import { audioAction } from '../../../store/actions/data.action';

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
        console.log(this.skyValue);
        this.addAtmosphericSound(this.skyValue);
      });
  }

  private addAtmosphericSound(sky) {
    switch(sky) {
      case 'd':
      case 'e':
      case 'f':
      case 'p':
      case 'r':
      case 's':
          this.store.dispatch(audioAction({payload: {channel: 'atmospheric', track: 'rain-and-thunder-loop.mp3' }}));
        break;
      default:
          this.store.dispatch(audioAction({payload: {channel: 'atmospheric', track: null }}));
        break;;
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
