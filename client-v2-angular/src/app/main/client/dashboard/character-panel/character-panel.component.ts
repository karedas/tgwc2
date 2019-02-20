import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataState } from 'src/app/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { getHero, getDashboardVisibility } from 'src/app/store/selectors';
import { Subject, Observable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IStatus, IHero, ITarget } from 'src/app/models/data/hero.model';
import { GameService } from 'src/app/services/game.service';

import { MediaObserver, MediaChange } from '@angular/flex-layout';

@Component({
  selector: 'tg-character-panel',
  templateUrl: './character-panel.component.html',
  styleUrls: ['./character-panel.component.scss']
})
export class CharacterPanelComponent implements OnInit, OnDestroy {


  heroDashboard$: Observable<any>;

  status: {} = { drink: 0, food: 0, hit: 0, move: 0 };

  inCombat = false;
  heroName: string;
  heroAdjective: string;
  heroImage = 'assets/images/interface/default_avatar.png';

  conva: number;
  walk: string;
  combatSet: any;
  money: number = 0;
  moneyValue: string = '';

  // Enemy Target Values
  enemyHealt = 0;
  enemyMove = 0;
  enemyName = '';
  enemyIcon: number = null;


  toggleStatus$: Observable<boolean>;

  private watcherMedia: Subscription;
  activeMediaQuery = '';

  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private game: GameService,
    private mediaObserver: MediaObserver) {

    // TODO, MOVE IN APP ROOT COMPONENT
    this.watcherMedia = this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? change.mqAlias : '';
    });

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
            this.setMoneyAmountLabel(hero.money);
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

  setMoneyAmountLabel(money: any) {

    let dividend = 1;
    money = parseInt(money);

    if (money < 10) {
      this.moneyValue = 'mr'

    }
    if (money >= 10 && money < 100) {
      this.moneyValue = 'ma'
      dividend = 10;

    }
    else if (money >= 100 && money < 1000) {
      dividend = 100;
      this.moneyValue = 'mo'
    }
    else if (money >= 1000) {
      dividend = 1000;
      this.moneyValue = 'co'
    }

    if (money > 0) {
      money = parseFloat(money);
      money = Math.round(money) / dividend;
      money.toFixed(2).replace('.', ',');
    }

    this.money = money;
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
    this.watcherMedia.unsubscribe();
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
