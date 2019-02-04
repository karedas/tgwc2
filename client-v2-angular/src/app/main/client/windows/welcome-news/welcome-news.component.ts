import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

import { NgScrollbar } from 'ngx-scrollbar';
import { DynamicDialogRef } from 'primeng/api';

@Component({
  selector: 'tg-welcome-news',
  templateUrl: './welcome-news.component.html',
  styleUrls: ['./welcome-news.component.scss'],
})
export class WelcomeNewsComponent  implements AfterViewInit{

  
  @ViewChild(NgScrollbar) textAreaScrollbar: NgScrollbar;
  
  
  private dontShowNextTime: boolean = false;

  constructor(
    private game: GameService,
    private ref: DynamicDialogRef
  ) {
  }

  ngAfterViewInit(): void {
      this.textAreaScrollbar.update();
  }

  onContinue(): void {
    if (this.dontShowNextTime) {
      localStorage.setItem('welcomenews', '1');
    }
    this.ref.close();
    this.game.sendToServer('');
  }

  onCheckbox(event: any): void {
    this.dontShowNextTime = !this.dontShowNextTime;
  }
}
