import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tg-client',
  template: '<tg-client-container></tg-client-container>',
})

export class ClientComponent implements OnInit {

  config: any;

  // private
  private _unsubscribeAll: Subject<any>;


  constructor(
    private _configService: ConfigService
  ) {
    this._unsubscribeAll = new Subject();
   }

  ngOnInit(): void {

    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.config = config;
      });
  }
}
