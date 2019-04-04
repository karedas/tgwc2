import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { GameService } from 'src/app/main/client/services/game.service';

import { NgScrollbar } from 'ngx-scrollbar';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'tg-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent  implements AfterViewInit {


  @ViewChild(NgScrollbar) textAreaScrollbar: NgScrollbar;

  dontShowNextTime = false;

  constructor(
    private game: GameService,
    private _configService: ConfigService
  ) {
  }

  ngAfterViewInit(): void {
      this.textAreaScrollbar.update();
  }

  onContinue(): void {
    // Save Next Login News display based on user's choice
    if (this.dontShowNextTime) {
      this._configService.config = { news: false };
    }
    this.game.sendToServer('');
  }

  onCheckbox(event: any): void {
    this.dontShowNextTime = !this.dontShowNextTime;
  }
}
