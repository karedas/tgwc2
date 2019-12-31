import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IHero } from 'src/app/main/client/models/data/hero.model';
import { DataState } from 'src/app/main/client/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { getHero } from 'src/app/main/client/store/selectors';
import { GameService } from 'src/app/main/client/services/game.service';
import { NgScrollbar } from 'ngx-scrollbar';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tg-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit, OnDestroy {

  @ViewChild(NgScrollbar, {static: false}) textAreaScrollbar: NgScrollbar;

  heroInfo$: Observable<IHero>;
  description = '';

  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private game: GameService,
  ) {

    this.heroInfo$ = this.store.pipe(select(getHero));
    this._unsubscribeAll = new Subject();

   }

  ngOnInit() {
    this.heroInfo$.pipe(
      takeUntil( this._unsubscribeAll )).subscribe(
        (( hero: IHero ) => { this.parseDesc( hero.desc ); }
      ));
  }


  sendChangeDescriptionRequest() {
    this.game.processCommands('cambia desc');
  }

  parseDesc(value: string) {
    if (value) {
      this.description = value.replace(/([.:?!,])\s*\n/gm, '$1').replace(/\r?\n|\r/g, ' ');
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
