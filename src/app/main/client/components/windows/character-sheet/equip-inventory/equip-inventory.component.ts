import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { equipPositionByName, pos_to_order } from 'src/app/main/client/common/constants';
import { GameService } from 'src/app/main/client/services/game.service';
import { getEquip, getInventory } from 'src/app/main/client/store/selectors';
import { DataState } from 'src/app/main/client/store/state/data.state';

@Component({
  selector: 'tg-equip-inventory',
  templateUrl: './equip-inventory.component.html',
  styleUrls: ['./equip-inventory.component.scss'],
})
export class EquipInventoryComponent implements OnInit, OnDestroy {
  @Input('subTab') subTab = 'equip';

  equipPositionValue: {};
  equip_by_pos = pos_to_order;
  equipment$: Observable<any>;
  inventory$: Observable<any>;
  wprc: number;
  weight: number;
  equip = [];


  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private gameService: GameService,
  ) {

    this.equipment$ = this.store.pipe(select(getEquip));
    this.inventory$ = this.store.pipe(select(getInventory));
    this.equipPositionValue = Object.entries(equipPositionByName);
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {

    this.inventory$.pipe(takeUntil(this._unsubscribeAll));

    this.equipment$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(equipment => {
        if (equipment !== undefined) {
          this.wprc = equipment.wprc;
          this.weight = equipment.weight;
          this.equip = this.gameService.orderObjectsList(equipment, 'equip');
        }
      });
  }

  buttonClick(what: string, event: Event) {

    if (what === 'equip') {
      this.subTab = what;
      this.gameService.processCommands('equip', false);

    }
    if (what === 'inventory') {
      this.subTab = what;
      this.gameService.processCommands('inv', false);
    }
  }

  onInteract(item) {
    this.gameService.interact(item, null, true);
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
