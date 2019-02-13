import { Component, ViewChild, ElementRef } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tg-extraboard',
  templateUrl: './extraboard.component.html',
  styleUrls: ['./extraboard.component.scss'],
})
export class ExtraboardComponent {

  @ViewChild('#shortcutOpen') shortcutLink: ElementRef;

  constructor(private game: GameService) { }


  buttonClick(cmd: string) {
    this.game.sendToServer(cmd);
  }
}
