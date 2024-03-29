import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/main/client/services/game.service';
import { Observable, Subject } from 'rxjs';
import { IHero } from 'src/app/main/client/models/data/hero.model';
import { select, Store } from '@ngrx/store';
import { getHero } from 'src/app/main/client/store/selectors';
import { takeUntil } from 'rxjs/operators';
import { TGState } from 'src/app/main/client/store';

@Component({
  selector: 'tg-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit, OnDestroy {

  public hero$: Observable<IHero>;
  private showStatus$: Observable<any>;

  private _unsubscribeAll: Subject<any>;

  showed = false;

  constructor(
    private game: GameService,
    private store: Store<TGState>
    ) {

    this.hero$ = this.store.pipe(select(getHero));
    this.showStatus$ = this.game.getStatusInline();

    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {
    this.showStatus$.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((show) => {
        this.showed = show;
      });

    this.hero$.pipe(takeUntil(this._unsubscribeAll)).subscribe();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
