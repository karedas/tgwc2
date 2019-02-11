import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { getSkills } from 'src/app/store/selectors';

@Component({
  selector: 'tg-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SkillsComponent implements OnInit {

  skills$: Observable<any>;

  constructor(
    private game: GameService,
    private store: Store<DataState>
  ) { 

    this.skills$ = this.store.pipe(select(getSkills));
  }

  ngOnInit() {
    this.skills$.subscribe();
  }

}
