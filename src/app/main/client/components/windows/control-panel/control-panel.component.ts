import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { TGConfig } from '../../../client-config';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'tg-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss'],
})
export class ControlPanelComponent implements OnInit, OnDestroy {

  tgConfig: TGConfig;
  tabOpen = 0;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _configService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this._unsubscribeAll = new Subject();
    this.tabOpen = data.tab;
  }

  ngOnInit() {
    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.tgConfig = config;
      });
  }

  setTab(index: number) {
    this.tabOpen = index;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
