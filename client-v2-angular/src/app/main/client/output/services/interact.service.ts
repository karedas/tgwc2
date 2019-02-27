import { Injectable } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Injectable({
  providedIn: 'root'
})
export class InteractService {
  constructor(private game: GameService) {}

  interact(event: Event, item: any, index: number, list?: boolean) {
    event.preventDefault();
    if (!item.sz) {
      if (!item.cntnum) {
        this.game.processCommands(`guarda &${item.mrn[0]}`);
      } else if (item.cntnum && item.mrn.length > 0) {
        this.game.processCommands(`guarda &${item.mrn[0]} &${item.cntnum}`);
      }
    } else if (list) {
      console.log(list);
      console.log(item);
      const mrn = item.mrn.length ? item.mrn[0] : item.mrn;
      this.game.processCommands(`guarda &${mrn}`);
    }
  }

  isExpandeable(event: Event, item: any, index: number): boolean {
    event.preventDefault();
    //  Is Expandable
    if (item.sz) {
      return true;
    } else { false; }
  }
}
