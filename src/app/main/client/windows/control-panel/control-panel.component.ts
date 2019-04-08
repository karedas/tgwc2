import { Component, OnInit, OnDestroy } from '@angular/core';
import { TGConfig, tgConfig } from '../../client-config';
import { ConfigService } from 'src/app/services/config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tg-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit, OnDestroy {

  tgConfig: TGConfig;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _configService: ConfigService
  ) {

    this._unsubscribeAll = new Subject();
   }

  ngOnInit() {
    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.tgConfig = config;
      });
  }

  // Format audio to Decimal only for user view
  formatAudio(value: number | null) {
    if (!value) {
      return 0;
    }

    if (value >= 0.1) {
      return value * 10;
    }

    return value;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
