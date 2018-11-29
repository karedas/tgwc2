import { Component, OnInit} from '@angular/core';
// import { Store, select } from "@ngrx/store";
// import { GameState } from './store/game.state';
// import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `<tg-client></tg-client>`,
})

export class AppComponent implements OnInit {
  title = 'The Gate v2 WebClient';
  // gameState: any;

  constructor(
    // private store: Store<GameState>,
    // public authService: AuthService,
  ) { }

  ngOnInit(): void {
    // this.authService.authStatus.subscribe(authStatus => {
    //   if(!authStatus.isAuthenticated) {
    //     console.log('authenticated');
    //   }
    // });

    // this.gameState = this.store.select<GameState>('gameState');
  }
}
