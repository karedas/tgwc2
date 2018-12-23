import { Component } from '@angular/core';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Observable, BehaviorSubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { MessageState } from 'src/app/store/state/message.state';
import * as fromSelectors from 'src/app/store/selectors';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tg-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent {
  messages$: Observable<MessageState>;

  constructor(private store: Store<MessageState>) { 
    
    this.messages$ = this.store.select(fromSelectors.getMessage)
/*     this.messages$.subscribe(data => console.log(data));
*/

  }

}
