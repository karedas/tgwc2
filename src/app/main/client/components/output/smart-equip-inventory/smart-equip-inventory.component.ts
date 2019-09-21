import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { GameService } from '../../../services/game.service';
import { ConfigService } from 'src/app/services/config.service';
import { TGConfig } from '../../../client-config';
import { map } from 'rxjs/operators';
@Component({
  selector: 'tg-smart-equip-inventory',
  templateUrl: './smart-equip-inventory.component.html',
})
export class SmartEquipInventoryComponent implements OnInit, OnDestroy {
  @Input() draggingSplitArea: boolean;

  tab: string;
  collapsed = false;
  roomIsVisible: boolean;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private gameService: GameService,
    private _configService: ConfigService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this._configService.config
      .pipe(
        takeUntil(this._unsubscribeAll), 
        map((config: TGConfig) => { return { room: config.widgetRoom, equipinventory: config.widgetEquipInv }})
      )
      .subscribe((config: any) => {
        setTimeout(() => {
          this.setupEquipInventory(config.equipinventory);
          this.roomIsVisible = config.room.visible;
        });
      });
  }

  private setupEquipInventory(c: any) {
      this.collapsed = c.collapsed;
      this.tab = c.selected;
  }

  onTabClick(cmd: string, tab: string, event: Event) {
    event.stopImmediatePropagation();
    this.tab = tab;
    this.gameService.processCommands('@' + cmd, false);
  }

  onCollapse() {
    this.collapsed = !this.collapsed;
    // store in the config
    this._configService.setConfig({
      widgetEquipInv: { collapsed: this.collapsed }
    });
  }



  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
