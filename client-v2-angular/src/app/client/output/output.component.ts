import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import * as fromSelectors from 'src/app/store/selectors';

@Component({
  selector: 'tg-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent {
  history: Array<string> = [];
  
  private messages$: Observable<DataState>;

  constructor(private store: Store<DataState>) { 
    this.messages$ = this.store.select(fromSelectors.getData);
    this.messages$.subscribe(
      msg => {
          this.history.push(msg.data) 
      }
    )
  }
}
