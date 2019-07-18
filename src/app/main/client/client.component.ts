import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from './services/game.service';
import { DialogV2Service } from './common/dialog-v2/dialog-v2.service';
import { InputService } from './components/input/input.service';

@Component({
  selector: 'tg-client',
  template: '<tg-client-container></tg-client-container>',
})

export class ClientComponent {

  constructor(
    private gameService: GameService,
    private dialogV2Service: DialogV2Service,
    private inputService: InputService) {
    this.openNews();
  }

  openNews() {
    console.log('opennewssss');
    if (this.gameService.tgConfig.news) {
      this.dialogV2Service.openNews(false);
    }
    else {
      this.gameService.sendToServer('');
      this.inputService.focus();
    }
  }
}
