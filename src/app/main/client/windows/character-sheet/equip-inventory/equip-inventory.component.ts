import { Component, OnInit, OnDestroy, ViewEncapsulation, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { getEquip, getInventory } from 'src/app/store/selectors';
import { equip_positions_by_name, pos_to_order } from 'src/app/main/common/constants';
import { takeUntil } from 'rxjs/operators';
import { GameService } from 'src/app/services/game.service';
import { InputService } from '../../../dashboard/input/input.service';

@Component({
  selector: 'tg-equip-inventory',
  templateUrl: './equip-inventory.component.html',
  styleUrls: ['./equip-inventory.component.scss'],
  encapsulation: ViewEncapsulation.None
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
    
    this.inventory$.pipe(takeUntil(this._unsubscribeAll)).subscribe();
    this.equipment$.pipe(takeUntil(this._unsubscribeAll))
      .subscribe(equipment => {
        if(equipment !== undefined) {
          this.equipUpdate(equipment);
        }
      });
      
    
    this.resetUpdateBeforeProceed();

    if(this.openedSubTab === 'equip') {
      this.game.client_update.equipOpen = true;
    }
    if(this.openedSubTab === 'inventory') {
      this.game.client_update.invOpen = true;
    }
  }

  equipUpdate(eq: any) {
    let cont = {
      list: []
    };

    Object.keys(eq).forEach( (poskey: any, eqData:any) => {
      let where = equip_positions_by_name[poskey];
      if(where) {
        cont.list = cont.list.concat(eq[poskey][0]);
      }

    });
    cont.list.sort((a,b) => {
      let eq_pos_a = Object.keys(a.eq) ? pos_to_order[a.eq[0]] : 0;
      let eq_pos_b = Object.keys(b.eq) ? pos_to_order[b.eq[0]] : 0;
        return <number>eq_pos_a - <number>eq_pos_b;
    })

    this.equip = cont.list;
  }

  buttonClick(what: string, event: Event) {

    this.resetUpdateBeforeProceed();
    this.inputService.focus();
    if (what === 'equip') {
      this.openedSubTab = what;
      this.game.processCommands('equip');
      this.game.client_update.equipOpen  = true;

    }
    if (what === 'inventory') {
      this.openedSubTab = what;
      this.game.processCommands('inv');
      this.game.client_update.invOpen = true; 
    }
  }

  resetUpdateBeforeProceed() {
    this.game.client_update.invOpen = false; 
    this.game.client_update.equipOpen  = false;  
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
