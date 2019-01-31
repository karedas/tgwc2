import { Component } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'tg-welcome-news',
  templateUrl: './welcome-news.component.html',
  styleUrls: ['./welcome-news.component.scss'],
})
export class WelcomeNewsComponent  {

  private dontShowNextTime = false;

  constructor(
    private game: GameService,
    public dialogRef: MatDialogRef<WelcomeNewsComponent>
    ) {}

  onContinue(): void {
    if (this.dontShowNextTime) {
      localStorage.setItem('welcomenews', '1');
    }

    this.dialogRef.close();
    this.game.sendToServer('');
  }

  onCheckbox(event: any): void {
    this.dontShowNextTime = !this.dontShowNextTime;
  }
}
