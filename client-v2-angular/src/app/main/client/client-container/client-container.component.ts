import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ClientState } from 'src/app/store/state/client.state';
import { getWelcomeNews } from 'src/app/store/selectors';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tg-client-container',
  templateUrl: './client-container.component.html',

})

export class ClientContainerComponent {

  showWelcomeNews: boolean;

  constructor(private store: Store<ClientState>, private game: GameService) {
    this.showWelcomeNews = this.game.newsNeeded;
  }
}
