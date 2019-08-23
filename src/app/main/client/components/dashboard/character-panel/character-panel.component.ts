import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataState } from 'src/app/main/client/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { getHero } from 'src/app/main/client/store/selectors';
import { Subject, Observable, Subscription } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IHero, ITarget } from 'src/app/main/client/models/data/hero.model';
import { GameService } from 'src/app/main/client/services/game.service';

import { MediaObserver, MediaChange } from '@angular/flex-layout';

import { hero_position } from 'src/app/main/client/common/constants';
import { ConfigService } from 'src/app/services/config.service';
import { TGConfig } from '../../../client-config';

@Component({
  selector: 'tg-character-panel',
  templateUrl: './character-panel.component.html',
  styleUrls: ['./character-panel.component.scss']
})
export class CharacterPanelComponent implements OnInit, OnDestroy {

  readonly env = environment;

  tgConfig: TGConfig;
  hero$: Observable<any>;
  hero_pos = hero_position;
  inCombat = false;
  // Hero Values
  heroImage = 'assets/images/interface/default_avatar.png';
  money = 0;
  moneyValue = '';
  // Enemy Target Values
  enemyHealt = 0;
  enemyMove = 0;
  enemyName = '';
  enemyIcon: number = null;

  activeMediaQuery = '';

  private watcherMedia: Subscription;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private game: GameService,
    private mediaObserver: MediaObserver,
    private _configService: ConfigService
  ) {

    this.hero$ = this.store.pipe(select(getHero));

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {


    // Subscribe to config changes
    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.tgConfig = config;
      });

    // TODO Move this in the root component
    this.watcherMedia = this.mediaObserver.asObservable()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((changes: MediaChange[]) => {
        changes.forEach(change => {
          this.activeMediaQuery = change ? change.mqAlias : '';
        });
      });

    this.hero$
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter(c => !!c)
      )
      .subscribe((hero: IHero) => {
        if (hero) {
          this.setCombatPanel(hero.target);
          this.setMoneyAmountLabel(hero.money);
        }
      });
  }

  setMoneyAmountLabel(money: any) {

    let dividend = 1;
    money = parseInt(money, 10);

    if (money < 10) {
      this.moneyValue = 'mr';
    }
    if (money >= 10 && money < 100) {
      this.moneyValue = 'ma';
      dividend = 10;

    } else if (money >= 100 && money < 1000) {
      dividend = 100;
      this.moneyValue = 'mo';
    } else if (money >= 1000) {
      dividend = 1000;
      this.moneyValue = 'mp';
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
