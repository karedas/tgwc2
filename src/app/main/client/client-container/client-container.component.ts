import { Component, ViewEncapsulation, OnDestroy, Renderer2, AfterViewInit, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UIState } from 'src/app/store/state/ui.state';
import { Store, select } from '@ngrx/store';
import { filter, takeUntil } from 'rxjs/operators';
import { GameService } from 'src/app/services/game.service';
import { WindowsService } from '../windows/windows.service';
import { ConfigService } from 'src/app/services/config.service';
import { tgConfig } from '../client-config';

@Component({
  selector: 'tg-client-container',
  templateUrl: './client-container.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ClientContainerComponent implements OnInit, OnDestroy {

  tgConfig: any;

  private welcomeNews: Observable<boolean>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<UIState>,
    private game: GameService,
    private render: Renderer2,
    private windowsService: WindowsService,
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

    //  Welcome News
    // this.welcomeNews.pipe(
    //   takeUntil(this._unsubscribeAll),
    //   filter((r) => r === true)).subscribe(() => {
    //     if (!tgConfig.news) {
    //       this.game.sendToServer('');
    //     } else {
    //       this.showNews();
    //     }
    //   });
  }

  // showNews() {
  //   setTimeout(() => {
  //     this.render.addClass(document.body, 'overlay-dark');
  //     this.windowsService.openWelcomeNews();
  //   }, 100);
  // }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
