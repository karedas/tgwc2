import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { GameService } from 'src/app/services/game.service';
import { map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'tg-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent {
  
  private output = [];

  constructor(
    private store: Store<DataState>, 
    private game: GameService) {
      this.game.getHistory().subscribe(msg  => this.output = msg );
     
    }
  }
