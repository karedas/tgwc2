import { Injectable } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Injectable({
  providedIn: 'root'
})
export class InteractService {
  constructor(private game: GameService) {}

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
      // this.togglePanel[index] = !this.togglePanel[index];
    }
  }
}
