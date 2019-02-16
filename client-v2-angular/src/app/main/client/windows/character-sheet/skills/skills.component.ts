import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { getSkills } from 'src/app/store/selectors';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tg-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SkillsComponent implements OnInit, OnDestroy {

  skills$: Observable<any>;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private game: GameService,
    private store: Store<DataState>
  ) {

    this.skills$ = this.store.pipe(select(getSkills));

    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.skills$.pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
