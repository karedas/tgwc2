import { Component, OnInit, OnDestroy, ViewEncapsulation, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/main/client/store/state/data.state';
import { getEquip, getInventory } from 'src/app/main/client/store/selectors';
import { equipPositionByName, pos_to_order } from 'src/app/main/client/common/constants';
import { takeUntil } from 'rxjs/operators';
import { GameService } from 'src/app/main/client/services/game.service';
import { InputService } from '../../../input/input.service';

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
    private inputService: InputService
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
