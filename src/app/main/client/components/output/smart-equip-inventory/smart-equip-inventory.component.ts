import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { DataState } from '../../../store/state/data.state';
import { getEquip, getInventory } from '../../../store/selectors';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { GameService } from '../../../services/game.service';
import { equipPositionByName } from '../../../common/constants';
import { ConfigService } from 'src/app/services/config.service';
import { TGConfig } from '../../../client-config';

@Component({
  selector: 'tg-smart-equip-inventory',
  templateUrl: './smart-equip-inventory.component.html',
  styleUrls: ['./smart-equip-inventory.component.scss'],
})
export class SmartEquipInventoryComponent implements OnInit, OnDestroy {
  @Input() draggingSplitArea: boolean;
  @Input() showAccordionView: boolean;

  equip: any[] = [];
  inventory: any[] = [];
  tab = 1;
  equipPositionValue: {};
  show = false;


  private _equipment$: Observable<any>;
  private _inventory$: Observable<any>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private gameService: GameService,
    private _configService: ConfigService
  ) {
    this.equipPositionValue = Object.entries(equipPositionByName);
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
        if (inventory !== undefined) {
          this.inventory = inventory.list;
        }
      });
  }

  onTabClick(cmd: string, tab: number, event: Event) {
    event.stopImmediatePropagation();
    this.tab = tab;
    this.gameService.processCommands('@' + cmd, false, false);
  }

  onCollapse() {
    this.show = !this.show;
    // store in the config
    this._configService.setConfig({
      equipInventoryBox: {visible: this.show}
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
