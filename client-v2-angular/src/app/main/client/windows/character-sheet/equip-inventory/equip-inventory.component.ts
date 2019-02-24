import { Component, OnInit, OnDestroy, ViewEncapsulation, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { getEquip, getInventory } from 'src/app/store/selectors';
import { equip_positions_by_name } from 'src/app/main/common/constants';
import { takeUntil } from 'rxjs/operators';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tg-equip-inventory',
  templateUrl: './equip-inventory.component.html',
  styleUrls: ['./equip-inventory.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EquipInventoryComponent implements OnInit, OnDestroy {

  equipPositionValue: {} = equip_positions_by_name;

  equipment$: Observable<any>;
  inventory$: Observable<any>;

  @Input('subTab') openedSubTab = 'equip';

  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private game: GameService
     ) {

    this.equipment$ = this.store.pipe(select(getEquip));
    this.inventory$ = this.store.pipe(select(getInventory));

    this._unsubscribeAll = new Subject<any>();
   }

  ngOnInit() {
    this.equipment$.pipe(takeUntil(this._unsubscribeAll)).subscribe();
    this.inventory$.pipe(takeUntil(this._unsubscribeAll)).subscribe();
  }

  buttonClick(what: string) {
    if (what === 'equip') {
      this.openedSubTab = what;
      this.game.processCommands('equip');
    }
    if (what === 'inventory') {
      this.openedSubTab = what;
      this.game.processCommands('inv');
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
