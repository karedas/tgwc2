import { Component} from '@angular/core';
import { Store } from '@ngrx/store';
import { GameState } from './store/state/game.state'; 

@Component({
  selector: 'app-root',
  template: `<tg-client [state]="gameState$ | async"></tg-client>`,  
})

export class AppComponent {
  title = 'The Gate v2 WebClient';
  gameState$: any;

  constructor(private store: Store<GameState>) {  
    this.gameState$ = this.store.select<GameState>('gameState');
  }
}