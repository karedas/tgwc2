import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { GameService } from '../../../services/game.service';
import { ConfigService } from 'src/app/services/config.service';
import { TGConfig } from '../../../client-config';

@Component({
  selector: 'tg-smart-equip-inventory',
  templateUrl: './smart-equip-inventory.component.html',
})
export class SmartEquipInventoryComponent implements OnInit, OnDestroy {
  @Input() draggingSplitArea: boolean;

  tab = 1;
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
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: TGConfig) => {
        setTimeout(() => {
          this.collapsed = config.widgetEquipInv.collapsed;
        });
      });
  }

  onTabClick(cmd: string, tab: number, event: Event) {
    event.stopImmediatePropagation();
    this.tab = tab;
    this.gameService.processCommands('@' + cmd, false, false);
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
