import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UIState } from 'src/app/store/state/ui.state';
import { Store, select } from '@ngrx/store';
import { getWelcomeNews } from 'src/app/store/selectors';
import { filter, takeUntil } from 'rxjs/operators';
import { GameService } from 'src/app/services/game.service';
import { DialogService as DynamicDialogService} from 'primeng/api';
import { WelcomeNewsComponent } from '../windows/welcome-news/welcome-news.component';

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
    private dymamicDialogService: DynamicDialogService
  ) {

    this.welcomeNews = this.store.pipe(select(getWelcomeNews));

    this._unsubscribeAll = new Subject<any>();
  }


  ngAfterViewInit(): void {

    //  Welcome News
    this.welcomeNews.pipe(
      takeUntil(this._unsubscribeAll),
      filter((r) => r === true)).subscribe(
        (req: boolean) => {
          if (localStorage.getItem('welcomenews')) {
            this.game.sendToServer('');
          } else {
            this.openWelcomeNews();
          }
        }
      );
  }

  openWelcomeNews() {
    setTimeout(() => {
      const ref = this.dymamicDialogService.open(WelcomeNewsComponent, {
        header: 'Notizie',
        styleClass: 'op-100',
        closable: false,
        width: '750px',
        height: '500px',
        style: {'max-width': '100%', 'max-height': '100%'},
        contentStyle: { 'max-height': '100%', 'max-width': '100%', 'overflow': 'auto' }
      });

    }, 100);
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
