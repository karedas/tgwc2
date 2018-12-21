import { Component, OnInit } from '@angular/core';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MessageState } from 'src/app/store/state/message.state';

@Component({
  selector: 'tg-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent implements OnInit {

  messages$: Observable<Message>

  constructor(private store: Store<MessageState>) { 
    // this.messages$ = store.select()
  }

  ngOnInit() {
  }

}
