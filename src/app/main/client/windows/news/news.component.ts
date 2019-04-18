import { Component, ViewChild, OnInit } from '@angular/core';
import { GameService } from 'src/app/main/client/services/game.service';

import { NgScrollbar } from 'ngx-scrollbar';
import { ConfigService } from 'src/app/services/config.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'tg-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent  implements OnInit {


  @ViewChild(NgScrollbar) textAreaScrollbar: NgScrollbar;

  dontShowNextTime = false;

  constructor(
    private game: GameService,
    private _configService: ConfigService,
    private dialogRef: MatDialogRef<NewsComponent>,
  ) {
  }

  ngOnInit(): void {
    this.dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        this.textAreaScrollbar.update();
      });
    });

  }

  onContinue(): void {
    // Save Next Login News display based on user's choice
    if (this.dontShowNextTime) {
      this._configService.setConfig({ news: false });
    }
    this.game.sendToServer('');
    this.game.newsShowedFirstTime = true;
  }

  onCheckbox(event: any): void {
    this.dontShowNextTime = !this.dontShowNextTime;
  }
}
