import { Component, OnDestroy } from '@angular/core';
import { GameService } from './services/game.service';
import { DialogV2Service } from './common/dialog-v2/dialog-v2.service';
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

export class ClientComponent implements OnDestroy {

  tgConfig: TGConfig;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _configService: ConfigService,
    private gameService: GameService,
    private dialogV2Service: DialogV2Service,
    private inputService: InputService) {
      
      this._unsubscribeAll = new Subject<any>();
      this.openNews();
  }

  openNews() {

    // Subscribe to config changes
    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {

        this.tgConfig = config;

        if (this.tgConfig.news) {
          this.dialogV2Service.openNews(false);
        } else {
          this.gameService.sendToServer('');
          this.inputService.focus();
        }
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
