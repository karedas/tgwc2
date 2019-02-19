import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataState } from 'src/app/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { getHero, getDashboardVisibility } from 'src/app/store/selectors';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IStatus, IHero, ITarget } from 'src/app/models/data/hero.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tg-character-panel',
  templateUrl: './character-panel.component.html',
  styleUrls: ['./character-panel.component.scss']
})
export class CharacterPanelComponent implements OnInit, OnDestroy {


  heroDashboard$: Observable<any>;

  status: {} = {drink: 0, food: 0, hit: 0, move: 0};

  inCombat = false;
  heroName: string;
  heroAdjective: string;
  heroImage = 'assets/images/interface/default_avatar.png';

  conva: number;
  walk: string;
  combatSet: {};

  // Enemy Target Values
  enemyHealt = 0;
  enemyMove = 0;
  enemyName = '';
  enemyIcon: number = null;

  toggleStatus$: Observable<boolean>;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private game: GameService) {

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this.toggleStatus$ = this.store.pipe(select(getDashboardVisibility));

    this.store.pipe(select(getHero),
      takeUntil(this._unsubscribeAll)).subscribe(
        (hero: IHero) => {
          if (hero) {
            this.setStatus(hero.status);
            this.setCombatPanel(hero.target);
            this.heroName = hero.name;
            this.heroAdjective = hero.adjective;
            this.heroImage = environment.media_address + hero.image;
            
            this.walk = hero.walk;
            this.conva = hero.conva;
            this.combatSet = hero.combat;
          }
        }
      );
  }

  private setStatus(status: IStatus) {
    if (status !== undefined) {
      this.status = status;
    }
  }

  private setCombatPanel(target?: ITarget) {
    if (target && typeof target.hit !== 'undefined') {
      const lengthKeys = Object.keys(target).length;
      if (lengthKeys > 0) {
        this.inCombat = true;
        this.enemyHealt = target.hit;
        this.enemyMove = target.move;
        this.enemyIcon = target.icon;
        this.enemyName = target.name;
      }
    } else {
      this.inCombat = false;
      this.enemyHealt = 0;
      this.enemyMove = 0;
      this.enemyIcon = null;
      this.enemyName = '';
    }
  }

  openInfo() {
    this.game.processCommands('info');
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
