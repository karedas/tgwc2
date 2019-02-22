import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { Observable } from 'rxjs';
import { IDateTime } from 'src/app/models/data/dateTime.model';
import { getDateTime } from 'src/app/store/selectors';

@Component({
  selector: 'tg-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent {

  gameData$: Observable<IDateTime>;

  constructor(
    private store: Store<DataState>
  ) { 
    this.gameData$ = this.store.pipe(select(getDateTime));

  }
}
