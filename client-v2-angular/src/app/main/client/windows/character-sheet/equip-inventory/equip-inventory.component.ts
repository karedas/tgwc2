import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { getEquip, getInventory } from 'src/app/store/selectors';
import { equip_positions_by_name } from 'src/app/main/common/constants';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tg-equip-inventory',
  templateUrl: './equip-inventory.component.html',
  styleUrls: ['./equip-inventory.component.scss'],
})
export class EquipInventoryComponent implements OnInit, OnDestroy {

  equipPositionValue: {} = equip_positions_by_name;

  equipment$: Observable<any>;
  inventory$: Observable<any>;

  private _unsubscribeAll: Subject<any>;

  constructor(private store: Store<DataState>) {

    this.equipment$ = this.store.pipe(select(getEquip));
    this.inventory$ = this.store.pipe(select(getInventory));

    this._unsubscribeAll = new Subject<any>();
   }

  ngOnInit() {
    this.equipment$.pipe(takeUntil(this._unsubscribeAll)).subscribe();
    this.inventory$.pipe(takeUntil(this._unsubscribeAll)).subscribe();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
