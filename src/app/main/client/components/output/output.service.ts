import { Injectable, Output, EventEmitter } from '@angular/core';
import { GameService } from '../../services/game.service';

@Injectable({
  providedIn: 'root'
})
export class OutputService {

  // autoScroll: BehaviorSubject<boolean>;
  @Output() toggledAutoScroll: EventEmitter<boolean> = new EventEmitter();
  autoScroll = false;

  constructor() {
  }

  // Stop the output AutoScroll Event
  toggleAutoScroll(): boolean {
    this.autoScroll = !this.autoScroll;
    this.toggledAutoScroll.emit(this.autoScroll);

    if (this.autoScroll === false) {
    }

    return this.autoScroll;
  }

  // Uncollapse/Collapse a collapsed Container
  isExpandeable(event: Event, item: any, index: number): boolean {
    event.preventDefault();
    if (item.sz) {
      return true;
    }
  }
}
