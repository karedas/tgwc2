import { Injectable } from '@angular/core';
import { ScrollbarOutputService } from './scrollbar-output.service';

@Injectable({
  providedIn: 'root'
})
export class OutputService extends ScrollbarOutputService{

  // Uncollapse/Collapse a collapsed Container
  isExpandeable(event: Event, item: any, index: number): boolean {
    event.preventDefault();
    if (item.sz) {
      return true;
    }
  }
}
