import { Component, AfterViewInit } from '@angular/core';
import { ModalsService } from 'src/app/directives/modal/modal.service';
import { ModalConfiguration } from 'src/app/models/client/modal.interface';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tg-welcome-news',
  templateUrl: './welcome-news.component.html',
  styleUrls: ['./welcome-news.component.scss'],
})
export class WelcomeNewsComponent implements AfterViewInit {
  modalId: string = 'welcomeNews';
  modalConfig: ModalConfiguration = new ModalConfiguration();
  private dontShowNextTime: boolean = false;
  
  constructor(private modalService: ModalsService, private game: GameService) { 
    this.modalConfig.width = 800;
  }

  ngAfterViewInit(): void {
    if(!localStorage.getItem('welcomenews')) {
      this.open();
    }
  }

  onContinue(): void{
    if(this.dontShowNextTime) {
      localStorage.setItem('welcomenews', '1');
    }

    this.modalService.close(this.modalId);
    this.game.sendToServer('');
  }

  onCheckbox(event: any): void {
    this.dontShowNextTime = !this.dontShowNextTime;
  }

  open() {
    this.modalService.open(this.modalId);
  }
}
