import { Component, OnInit, Input } from '@angular/core';
import { IObjPersEqcont, IObjPersObjcont } from 'src/app/models/data/objpers.model';
import { GameService } from 'src/app/services/game.service';

import { equip_positions_by_name } from 'src/app/main/common/constants';

@Component({
  selector: 'tg-obj-pers-container',
  templateUrl: './obj-pers-container.component.html',
  styleUrls: ['./obj-pers-container.component.scss']
})
export class ObjPersContainerComponent implements OnInit {

  equipPositionValue: {} = equip_positions_by_name;
  newListEquip: any[];

  @Input('eqcont') eqcont: IObjPersEqcont[];
  @Input('objcont') objcont: IObjPersObjcont[];

  constructor(private game: GameService) {

     const keysAndProperty = Object.keys( equip_positions_by_name );

     this.newListEquip = keysAndProperty.map((val, k) => {
        return equip_positions_by_name[keysAndProperty[k]];
     } );
  }

  ngOnInit() {
  }


  getHstat(condprc: number): string {
    return this.game.getHsStatBgPos(condprc);
  }

}
