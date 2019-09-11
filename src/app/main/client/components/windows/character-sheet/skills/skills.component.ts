import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/main/client/store/state/data.state';
import { getSkills } from 'src/app/main/client/store/selectors';
import { hero_skills } from 'src/app/main/client/common/constants';

@Component({
  selector: 'tg-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent implements OnInit, OnDestroy {

  readonly heroSkillsValue = hero_skills;

  public skills$: Observable<any>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    // private game: GameService,
    private store: Store<DataState>
  ) {
    this.skills$ = this.store.pipe(select(getSkills));
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }



}
