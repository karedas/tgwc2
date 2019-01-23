import { Component, OnInit, Input } from '@angular/core';
import { IObjPersEqcont, IObjPersObjcont } from 'src/app/models/data/objpers.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tg-obj-pers-container',
  templateUrl: './obj-pers-container.component.html',
  styleUrls: ['./obj-pers-container.component.scss']
})
export class ObjPersContainerComponent implements OnInit {

  constructor(private game: GameService) { }

  @Input('eqcont') eqcont: IObjPersEqcont[];
  @Input('objcont') objcont: IObjPersObjcont[];

  ngOnInit() {
  }

  
  getHstat(condprc: number): string {
    return this.game.getHsStatBgPos(condprc);
  }

}
