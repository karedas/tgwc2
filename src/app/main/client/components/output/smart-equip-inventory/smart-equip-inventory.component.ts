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
        map((config: TGConfig) => { return config.widgetEquipInv })
      )
      .subscribe((config: any) => {
        setTimeout(() => {
          this.tab = config.selected;
          this.collapsed = config.collapsed;
        });
      });
  }

  setupEquipInventory(c: any) {
    // Simply close if it is equal to the open tab
    if (this.tab === c.selected) {
      console.log(' equal to ' + this.tab)
      this.collapsed = !c.collapsed;
    } else {
      // Select tab and show the Content.
      this.tab = c.selected;
      console.log('select ' + this.tab);
    }
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
