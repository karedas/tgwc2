import { Component, OnInit, OnDestroy } from '@angular/core';
import { TGConfig } from '../../client-config';
import { ConfigService } from 'src/app/services/config.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { hero_position, hero_attitude, hero_defense, hero_speed } from '../../common/constants';
import { getHero } from '../../store/selectors';
import { Store, select } from '@ngrx/store';
import { DataState } from '../../store/state/data.state';
import { GameService } from '../../services/game.service';
import { InputService } from '../input/input.service';

@Component({
  selector: 'tg-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnInit, OnDestroy  {

  tgConfig: TGConfig;
  hero$: Observable<any>;

  readonly speedValue = hero_speed;
  readonly positionValue = hero_position;
  readonly attitudeValue = hero_attitude;
  readonly defenseValue = hero_defense;



  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private gameService: GameService,
    private inputService: InputService,
    private _configService: ConfigService
  ) {
    this.hero$ = this.store.pipe(select(getHero));

    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    // Subscribe to config changes
    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.tgConfig = config;
      });
  }

  onClickButton(what: string, param?: string) {
    param = param ? ' ' + param.substring(0, 4) : '';
    this.gameService.processCommands(what + param);
    this.inputService.focus();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
