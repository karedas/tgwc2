import { Injectable, Output, EventEmitter } from '@angular/core';
import { GameService } from '../../services/game.service';

@Injectable({
  providedIn: 'root'
})
export class OutputService {

  // autoScroll: BehaviorSubject<boolean>;
  @Output() toggledAutoScroll: EventEmitter<boolean> = new EventEmitter();
  autoScroll = false;

  constructor(private game: GameService) {
  }

  // Stop the output AutoScroll Event
  toggleAutoScroll(): boolean {
    this.autoScroll = !this.autoScroll;
    this.toggledAutoScroll.emit(this.autoScroll);

    if (this.autoScroll === false) {
    }

    return this.autoScroll;
  }

  // Send request to server by element click
  interact(event: Event, item: any, index?: number) {

    event.preventDefault();

    /* If is not a List */
    if (!item.sz) {
      if (item.cntnum) {
        this.game.processCommands(`guarda &${item.mrn[0]} &${item.cntnum}`);
      } else {
        this.game.processCommands(`guarda &${item.mrn[0]}`);
      }
    }


    /* Is a List */
    if (item.sz) {
      if (!item.cntnum &&  index >= 0) {
        this.game.processCommands(`guarda &${item.mrn[index]}`);
      } else if (item.cntnum && index >= 0) {
        this.game.processCommands(`guarda &${item.mrn[index]} &${item.cntnum}`);
      }
    }
  }

  // Uncollapse/Collapse a collapsed Container
  isExpandeable(event: Event, item: any, index: number): boolean {
    event.preventDefault();
    if (item.sz) {
      return true;
    }
  }


}
