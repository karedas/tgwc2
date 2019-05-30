import { Component, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { GameService } from 'src/app/main/client/services/game.service';
import { DialogV2Service } from 'src/app/main/client/common/dialog-v2/dialog-v2.service';

@Component({
  selector: 'tg-extraboard',
  templateUrl: './extraboard.component.html',
  styleUrls: ['./extraboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExtraboardComponent {

  @ViewChild('#shortcutOpen', {static: true}) shortcutLink: ElementRef;

  constructor(private game: GameService, private dialogService: DialogV2Service) { }


  buttonClick(cmd: string) {
    this.game.processCommands(cmd);
  }

  openPreferences() {
    this.dialogService.openControlPanel();
  }
}
