import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UIState } from 'src/app/store/state/ui.state';
import { Store, select } from '@ngrx/store';
import { getWelcomeNews } from 'src/app/store/selectors';
import { filter, takeUntil } from 'rxjs/operators';
import { GameService } from 'src/app/services/game.service';
import { WindowsService } from '../windows/windows.service';

@Component({
  selector: 'tg-client-container',
  templateUrl: './client-container.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ClientContainerComponent implements OnDestroy {


  private _unsubscribeAll: Subject<any>;
  private welcomeNews: Observable<boolean>;



  constructor(
    private store: Store<UIState>,
    private game: GameService,
    private windowsService: WindowsService
  ) {
    this.welcomeNews = this.store.pipe(select(getWelcomeNews));
    this._unsubscribeAll = new Subject<any>();
  }

  ngAfterViewInit(): void {
    //  Welcome News
    this.welcomeNews.pipe(
      takeUntil(this._unsubscribeAll),
      filter((r) => r === true)).subscribe(
        () => {
          if (localStorage.getItem('welcomenews')) {
            this.game.sendToServer('');
            console.log('qui arriva');
            this.game._focusInput.next();
          } else {
            this.showNews();
          }
        }
      );
  }

  showNews() {
    setTimeout(() => {
      this.windowsService.openWelcomeNews();
    }, 100);
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
