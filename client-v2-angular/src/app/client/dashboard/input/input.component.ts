import { Component } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tg-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})

export class InputComponent {
  constructor(private game: GameService) { }

  onKeyDown(event: any, val: string) {
    event.target.value = '';
    this.game.processCommands(val, true);
  }

  focusInput(): void {

  }

}
