import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { IObjPersEqcont, IObjPersObjcont } from 'src/app/models/data/objpers.model';
import { GameService } from 'src/app/services/game.service';

import { equip_positions_by_name } from 'src/app/main/common/constants';

@Component({
  selector: 'tg-objpers-container',
  templateUrl: './objpers-container.component.html',
  styleUrls: ['./objpers-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjPersContainerComponent implements OnInit  {

  togglePanel: any = [];

  equipPositionValue  = equip_positions_by_name;
  newListEquip: any[];

  @Input('eqcont') eqcont: IObjPersEqcont;
  @Input('objcont') objcont: IObjPersObjcont;

  constructor(private game: GameService) {
     const keysAndProperty = Object.keys( equip_positions_by_name );

     this.newListEquip = keysAndProperty.map((val, k) => {
        return equip_positions_by_name[keysAndProperty[k]];
     } );
  }

  ngOnInit(): void {
    if (this.objcont) {
      this.populateToggleExpandable();
    }
  }

  populateToggleExpandable() {
    if (this.objcont.list ) {
      const total = this.objcont.list.length;
      for (let i = 0; i < total; i++) {
        this.togglePanel[i] = false;
      }
    }
  }

  onInteract(event: Event, item: any, index: number, list?: boolean) {
    event.preventDefault();
    if (!item.sz) {
      if (!item.cntnum) {
        this.game.processCommands(`guarda &${item.mrn[0]}`);
      } else if (item.cntnum && item.mrn.length > 0) {
        this.game.processCommands(`guarda &${item.mrn[0]} &${item.cntnum}`);
      }
    } else if (list) {
      const mrn = item.mrn.length ? item.mrn[0] : item.mrn;
      this.game.processCommands(`guarda &${mrn}`);
    }
  }

  onExpand(event: Event, item: any, index: number) {
    event.preventDefault();
    //  Is Expandable
    if (item.sz) {
      this.togglePanel[index] = !this.togglePanel[index];
    }
  }
}
