import { Component, ViewChild, ElementRef, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { GameService } from 'src/app/services/game.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'tg-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss'],

})
export class OutputComponent {

  output = [];
  private outputTrimLines: number = 500;
  test = 0;
  constructor(
    private store: Store<DataState>,
    private game: GameService) {
    
    

    this.game.getHistory()
      .subscribe(data => {
        if(this.output.length > this.outputTrimLines) {
          this.output = this.output.slice(1, this.output.length);
        }
        this.output.push(data);
      });
  }
}
