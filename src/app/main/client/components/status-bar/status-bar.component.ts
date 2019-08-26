import { Component, OnInit, OnDestroy } from '@angular/core';
import { TGConfig } from '../../client-config';
import { ConfigService } from 'src/app/services/config.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { hero_position } from '../../common/constants';
import { getHero } from '../../store/selectors';
import { Store, select } from '@ngrx/store';
import { DataState } from '../../store/state/data.state';

@Component({
  selector: 'tg-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnInit, OnDestroy  {

  tgConfig: TGConfig;
  hero_pos = hero_position;
  hero$: Observable<any>;
  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private store: Store<DataState>,
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

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
