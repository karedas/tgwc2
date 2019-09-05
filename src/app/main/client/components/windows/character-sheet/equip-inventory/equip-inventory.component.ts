import { Component, OnInit, OnDestroy, ViewEncapsulation, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/main/client/store/state/data.state';
import { getEquip, getInventory } from 'src/app/main/client/store/selectors';
import { equip_positions_by_name, pos_to_order } from 'src/app/main/client/common/constants';
import { takeUntil } from 'rxjs/operators';
import { GameService } from 'src/app/main/client/services/game.service';
import { InputService } from '../../../input/input.service';

@Component({
  selector: 'tg-equip-inventory',
  templateUrl: './equip-inventory.component.html',
  styleUrls: ['./equip-inventory.component.scss'],
})
export class EquipInventoryComponent implements OnInit, OnDestroy {

  equipPositionValue: {};
  equip_by_pos = pos_to_order;
  equipment$: Observable<any>;
  inventory$: Observable<any>;
  equip = [];

  @Input('subTab') openedSubTab = 'equip';

  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private game: GameService,
    private inputService: InputService
  ) {

    this.equipment$ = this.store.pipe(select(getEquip));
    this.inventory$ = this.store.pipe(select(getInventory));
    this.equipPositionValue = Object.entries(equip_positions_by_name);
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {

    this.inventory$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
    this.equipment$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(equipment => {
        if (equipment !== undefined) {
          this.equip = this.game.orderObjectsList(equipment);
        }
      });
  }

  buttonClick(what: string, event: Event) {

    this.inputService.focus();

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
