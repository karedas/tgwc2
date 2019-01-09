import { Component} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { GameService } from 'src/app/services/game.service';
import * as fromSelectors from 'src/app/store/selectors';
import { filter, skip, take, combineLatest } from 'rxjs/operators';

@Component({
  selector: 'tg-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss'],

})

export class OutputComponent {

  output = [];
  private outputTrimLines: number = 500;
  constructor(
    private store: Store<DataState>,
    private game: GameService) {
    
    //Listen Base Text Data
    this.store.pipe(combineLatest(
      fromSelectors.getDataBase,
      fromSelectors.getId
    )).subscribe(
        (base: string) => {
          const content = this.getContentObject('base', base);
          this.output.push(content);
          this.trimOutput();
        },
      )
      
    this.store.select(fromSelectors.getRoomBase)
      .pipe(filter(room => room && room !== undefined))
      .subscribe(
        (room: any) => {
          const content = this.getContentObject('room', room);
          this.output.push(content);
          this.trimOutput();
        }
      )
  }

  getContentObject(t: string, c: any): any {
    return Object.assign({}, {type: t, content: c})
  }

  private trimOutput(): void {
    if(this.output.length > this.outputTrimLines) {
      this.output = this.output.slice(1, this.output.length);
    }
  }
}
