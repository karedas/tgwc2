import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { DataState } from '../../store/state/data.state';
import { getInventory } from '../../store/selectors';
import { takeUntil } from 'rxjs/operators';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'tg-hero-inventory',
  templateUrl: './hero-inventory.component.html',
})
export class HeroInventoryComponent implements OnInit, OnDestroy {

  inventory: any[] = [];
  private _inventory$: Observable<any>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private gameService: GameService,
  ) {
    this._inventory$ = this.store.pipe(select(getInventory));
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this._inventory$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(inventory => {
        if (inventory !== undefined) {
          this.inventory = inventory.list;
        }
      });
  }

  interactElement(item, mine?: boolean) {
    this.gameService.interact(item, null, mine);
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
