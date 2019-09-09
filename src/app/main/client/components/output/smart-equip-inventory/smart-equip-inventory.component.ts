import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { DataState } from '../../../store/state/data.state';
import { getEquip, getInventory } from '../../../store/selectors';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { GameService } from '../../../services/game.service';
import { equip_positions_by_name } from '../../../common/constants';
import { ConfigService } from 'src/app/services/config.service';
import { TGConfig } from '../../../client-config';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'tg-smart-equip-inventory',
  templateUrl: './smart-equip-inventory.component.html',
  styleUrls: ['./smart-equip-inventory.component.scss']
})
export class SmartEquipInventoryComponent implements OnInit, OnDestroy {

  equip: any[] = [];
  inventory: any[] = [];
  tab: number = 1;
  equipPositionValue: {};
  show: boolean = false;


  private _equipment$: Observable<any>;
  private _inventory$: Observable<any>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private gameService: GameService,
    private _configService: ConfigService
  ) {
    this.equipPositionValue = Object.entries(equip_positions_by_name);
    this._equipment$ = this.store.pipe(select(getEquip));
    this._inventory$ = this.store.pipe(select(getInventory));
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {

    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe( (config: TGConfig ) => {
        setTimeout(() => {
          this.show = config.equipInventoryBox.visible;
        });
      });
    
    this._equipment$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(equipment => {
        if (equipment !== undefined) {
          this.equip = this.gameService.orderObjectsList(equipment);
        }
      });

    this._inventory$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(inventory => {
        if(inventory !== undefined) {
          this.inventory = inventory.list;
        }
      });
  }

  onTabClick(cmd: string, tab: number, event: Event) {
    event.stopImmediatePropagation();
    this.tab = tab;
    this.gameService.processCommands('@'+cmd, false, false);
  }

  onCollapse() {
    this.show = !this.show
    //store in the config
    this._configService.setConfig({
      equipInventoryBox: {visible: this.show}
    });
  }

  interactElement(item, mine: boolean) {
    this.gameService.interact(item, null, mine);
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
