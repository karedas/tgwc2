import { Component, Input } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { GameState } from 'src/app/store/state/game.state';

@Component({
  selector: 'tg-client-container',
  templateUrl: './client-container.component.html',
  styleUrls: ['./client-container.component.scss']
})
export class ClientContainerComponent {
  @Input() state: GameState;

  constructor( private game: GameService) {
    
  }

  ngOnInit() {
    this.loadClient();
  }

  loadClient(){
    this.game.newGame();
  }
}
