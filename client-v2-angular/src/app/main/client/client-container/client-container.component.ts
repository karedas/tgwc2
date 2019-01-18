import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { UIState } from 'src/app/store/state/ui.state';
import { getWelcomeNews } from 'src/app/store/selectors';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tg-client-container',
  templateUrl: './client-container.component.html',

})
export class ClientContainerComponent implements  OnDestroy{
  private _unsubscribeAll: Subject<any>;
  welcomeNews$: Observable<boolean>;


  constructor(private store: Store<UIState>) {

    this._unsubscribeAll = new Subject();
    this.welcomeNews$ = this.store.pipe(select(getWelcomeNews));
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
