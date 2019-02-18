import { Component, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tg-extraboard',
  templateUrl: './extraboard.component.html',
  styleUrls: ['./extraboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExtraboardComponent {

  @ViewChild('#shortcutOpen') shortcutLink: ElementRef;

  constructor(private game: GameService) { }


  buttonClick(cmd: string) {
    this.game.sendToServer(cmd);
  }

  
  openShortcutsPanel() {}

}
