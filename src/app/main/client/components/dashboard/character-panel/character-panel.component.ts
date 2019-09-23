import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataState } from 'src/app/main/client/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { getHero, getDirectionNotify } from 'src/app/main/client/store/selectors';
import { Subject, Observable, Subscription } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IHero, ITarget } from 'src/app/main/client/models/data/hero.model';
import { GameService } from 'src/app/main/client/services/game.service';

import { MediaObserver, MediaChange } from '@angular/flex-layout';

import { ConfigService } from 'src/app/services/config.service';
import { TGConfig } from '../../../client-config';
import { trigger, state, style, transition, animate, group } from '@angular/animations';

@Component({
  selector: 'tg-character-panel',
  templateUrl: './character-panel.component.html',
  styleUrls: ['./character-panel.component.scss'],
  animations: [
    trigger('fadeOutSlow', [
      state('*', style({
        display: 'inline-block',
        opacity: 0
      })),
      transition('* <=> *', [
        style({ opacity: 0 }),
        group([
          animate('0.2s ease-out', style({
            opacity: 1
          })),
          animate('0.2s 1.5s', style({
            opacity: 0
          }))
        ])
      ]),
    ])
  ]
})

export class CharacterPanelComponent implements OnInit, OnDestroy {

  readonly env = environment;

  tgConfig: TGConfig;
  hero$: Observable<any>;
  directionNotify$: Observable<any>;
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

  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private game: GameService,
    private _configService: ConfigService
  ) {

    this.hero$ = this.store.pipe(select(getHero));
    this.directionNotify$ = this.store.pipe(select(getDirectionNotify));

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    // Subscribe to config changes
    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.tgConfig = config;
      });

    this.hero$
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter(c => !!c)
      )
      .subscribe((hero: IHero) => {
        if (hero) {
          this.setCombatPanel(hero.target);
        }
      });
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
