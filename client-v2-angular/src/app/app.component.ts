import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from './store';
@Component({
  selector: 'app-root',
  // template: `<tg-client [state]="gameState$ | async"></tg-client>`,
  template: `<tg-client></tg-client>`,
})

export class AppComponent {
  title = 'The Gate v2 WebClient';
  gameState$: any;

  constructor(
    // private store: Store<fromRoot.State>,
    ) {

    // this.gameState$ = this.store.select<fromRoot.State>();
  }
}
