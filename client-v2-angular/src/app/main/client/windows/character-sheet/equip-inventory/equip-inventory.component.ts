import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { getEquip, getInventory } from 'src/app/store/selectors';
import { equip_positions_by_name } from 'src/app/main/common/constants';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tg-equip-inventory',
  templateUrl: './equip-inventory.component.html',
  styleUrls: ['./equip-inventory.component.scss']
})
export class EquipInventoryComponent implements OnInit {

  equipPositionValue: {} = equip_positions_by_name;

  equipment$: Observable<any>;
  inventory$: Observable<any>;

  constructor(private store: Store<DataState>) {
    console.log(this.equipPositionValue);

    this.equipment$ = this.store.pipe(select(getEquip));
    this.inventory$ = this.store.pipe(select(getInventory));
   }

  ngOnInit() {
  }

}
