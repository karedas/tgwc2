import { Component, ViewEncapsulation, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';
import { Subject } from 'rxjs';
import { TGConfig } from '../client-config';

@Component({
  selector: 'tg-client-container',
  templateUrl: './client-container.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ClientContainerComponent implements OnInit, OnDestroy {

  tgConfig: TGConfig;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _configService: ConfigService
  ) {

    this._unsubscribeAll = new Subject<any>();
  }


  ngOnInit(): void {

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
