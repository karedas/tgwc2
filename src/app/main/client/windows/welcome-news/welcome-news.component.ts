import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

import { NgScrollbar } from 'ngx-scrollbar';
import { DynamicDialogRef } from 'primeng/api';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'tg-welcome-news',
  templateUrl: './welcome-news.component.html',
  styleUrls: ['./welcome-news.component.scss'],
})
export class WelcomeNewsComponent  implements AfterViewInit {


  @ViewChild(NgScrollbar) textAreaScrollbar: NgScrollbar;

  dontShowNextTime = false;

  constructor(
    private game: GameService,
    private ref: DynamicDialogRef,
    private _configService: ConfigService
  ) {
  }

  ngAfterViewInit(): void {
      this.textAreaScrollbar.update();
  }

  onContinue(): void {
    if (this.dontShowNextTime) {
      this._configService.config = { news: true};
    }
    this.ref.close();
    this.game.sendToServer('');
  }

  onCheckbox(event: any): void {
    this.dontShowNextTime = !this.dontShowNextTime;
  }
}
