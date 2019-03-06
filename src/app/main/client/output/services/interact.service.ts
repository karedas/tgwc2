import { Injectable } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { identifierModuleUrl } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class InteractService {

  constructor(private game: GameService) {}

  interact(event: Event, item: any, index?: number) {
    event.preventDefault();
    
    /* If is not a List */
    if (!item.sz) {

      if(item.cntnum) {
        this.game.processCommands(`guarda &${item.mrn[0]} &${item.cntnum}`);
      }
      else {
        this.game.processCommands(`guarda &${item.mrn[0]}`);
      }
    }


    /* Is a List */
    if(item.sz) {
      if(!item.cntnum &&  index >= 0) {
        this.game.processCommands(`guarda &${item.mrn[index]}`);
      } 
      
      else if (item.cntnum && index >= 0) {
        this.game.processCommands(`guarda &${item.mrn[index]} &${item.cntnum}`);
      }
    }
  }

  isExpandeable(event: Event, item: any, index: number): boolean {
    event.preventDefault();
    if (item.sz) {
      return true;
    } else { false; }
  }
}
