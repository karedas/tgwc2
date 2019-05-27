import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { Observable, Subject } from 'rxjs';
import { IDateTime } from 'src/app/main/client/models/data/dateTime.model';
import { getDateTime } from 'src/app/store/selectors';
import { takeUntil } from 'rxjs/operators';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'tg-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit, OnDestroy {

  gameData$: Observable<IDateTime>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private game: GameService
  ) {
    this.gameData$ = this.store.pipe(select(getDateTime));
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit(): void {
    this.gameData$.pipe(takeUntil(this._unsubscribeAll)).subscribe();
  }

  getDateTime() {
    this.game.processCommands('data');
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
