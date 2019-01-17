import { Component } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tg-client-container',
  templateUrl: './client-container.component.html',

})

export class ClientContainerComponent {

  showNews: boolean;

  constructor(private game: GameService) {
  }
}
