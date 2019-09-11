import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, SimpleChanges, OnChanges } from '@angular/core';
import { IObjPersEqcont, IObjPersObjcont } from 'src/app/main/client/models/data/objpers.model';

import { equipPositionByName } from 'src/app/main/client/common/constants';
import { OutputService } from '../../output.service';
import { GameService } from 'src/app/main/client/services/game.service';

@Component({
  selector: 'tg-objpers-container',
  templateUrl: './objpers-container.component.html',
  styleUrls: ['./objpers-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjPersContainerComponent implements OnChanges  {

  togglePanel: any = [];

  equipPositionValue  = equipPositionByName;
  newListEquip: any[];

  @Input('eqcont') eqcont: IObjPersEqcont;
  @Input('objcont') objcont: IObjPersObjcont;

  constructor(
    public outputService: OutputService,
    private gameService: GameService
    ) {
     const keysAndProperty = Object.keys( equipPositionByName );
     this.newListEquip = keysAndProperty.map((val, k) => {
        return equipPositionByName[keysAndProperty[k]];
     } );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.eqcont = this.gameService.orderObjectsList(this.eqcont);

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

  onInteract(item: any, index: number, list?: boolean) {
    this.gameService.interact(item, index);
  }

  onExpand(event: Event, item: any, index: number) {
    if (this.outputService.isExpandeable(event, item, index)) {
      this.togglePanel[index] = !this.togglePanel[index];
    }
  }
}
