import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameService } from './services/game.service';
import { InputService } from './components/input/input.service';
import { Subject } from 'rxjs';
import { TGConfig } from './client-config';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'tg-client',
  templateUrl: './client.component.html',
  styles: [`
    :host {
      flex: 1;
      height: 100%;
    }
  `]
})

export class ClientComponent implements OnInit, OnDestroy {

  tgConfig: TGConfig;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _configService: ConfigService,
    private gameService: GameService,
    private inputService: InputService) {
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit(): void {
    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.tgConfig = config;
        this.gameService.sendToServer('');
        this.inputService.focus();
        // this.openNews();
      });
  }

  // openNews() {
  //   return;
  //   if (this.tgConfig.news) {
  //     // this.dialogV2Service.openNews(false);
  //   } else {
  //     this.gameService.sendToServer('');
  //     this.inputService.focus();
  //   }
  // }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
