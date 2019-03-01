import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { IObjPersEqcont, IObjPersObjcont } from 'src/app/models/data/objpers.model';

import { equip_positions_by_name } from 'src/app/main/common/constants';
import { InteractService } from '../../services/interact.service';

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

  constructor(
    public interactService: InteractService
    ) {
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
    this.interactService.interact(event, item, index, list);
  }

  onExpand(event: Event, item: any, index: number) {
    if (this.interactService.isExpandeable(event, item, index)) {
      this.togglePanel[index] = !this.togglePanel[index];
    }
  }
}
