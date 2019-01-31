import { Component, OnDestroy, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Store} from '@ngrx/store';
import { UIState } from 'src/app/store/state/ui.state';
import { getWelcomeNews } from 'src/app/store/selectors';
import { Subject, Observable } from 'rxjs';
import { DialogService } from '../../common/dialog/dialog.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tg-client-container',
  templateUrl: './client-container.component.html',
  encapsulation: ViewEncapsulation.None

})
export class ClientContainerComponent implements  OnDestroy, AfterViewInit {
  private _unsubscribeAll: Subject<any>;
  private welcomeNews: Observable<boolean>;


  constructor(
    private store: Store<UIState>,
    private dialogService: DialogService,
    private game: GameService
    ) {

    this._unsubscribeAll = new Subject();
  }

  ngAfterViewInit(): void {

    if(!localStorage.getItem('welcomenews')) {
      this.store.select(getWelcomeNews).subscribe(
        () => setTimeout(() => {
          this.dialogService.openWelcomeNews()
        })
      );
    } 
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
