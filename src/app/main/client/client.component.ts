import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { GameService } from './services/game.service';
import { InputService } from './components/input/input.service';
import { Subject } from 'rxjs';
import { TGConfig } from './client-config';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';
import { MediaObserver, MediaChange } from '@angular/flex-layout';

@Component({
  selector: 'tg-client',
  templateUrl: './client.component.html',
  styles: [`
    :host {
      flex: 1;
      height: 100%;
    }
  `],
})

export class ClientComponent implements OnInit, OnDestroy {

  tgConfig: TGConfig;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _configService: ConfigService,
    private gameService: GameService,
    private inputService: InputService,
    private mediaObserver: MediaObserver,
    private renderer: Renderer2,
    ) {
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'client-run');
    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.tgConfig = config;
        this.gameService.sendToServer('');
        this.inputService.focus();
      });


      this.mediaObserver.media$
      .pipe( takeUntil(this._unsubscribeAll))
      .subscribe((change: MediaChange) => {
        this.setViewByViewport(change);
    });
  }


  
  // Todo: Moving this in root place
  private setViewByViewport(change: MediaChange) {
    if ( change.mqAlias === 'xs' || change.mqAlias ==='sm') {
     this.gameService.isSmallDevice = true;
    } else {
      this.gameService.isSmallDevice = false;
    }
  }


  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'client-run');
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
