import { Component, AfterContentChecked, AfterViewInit } from '@angular/core';
import { ModalsService } from 'src/app/directives/modal/modal.service';
import { ModalConfiguration } from 'src/app/models/client/modal.interface';

@Component({
  selector: 'tg-welcome-news',
  templateUrl: './welcome-news.component.html',
  styleUrls: ['./welcome-news.component.scss'],
})
export class WelcomeNewsComponent implements AfterViewInit {
  modalId: string = 'welcomeNews';
  modalConfig: ModalConfiguration = new ModalConfiguration();

  constructor(private modalService: ModalsService) { 
    this.modalConfig.width = 800;
  }

  ngAfterViewInit(): void {
    this.modalService.open(this.modalId);
  }

  onContinue(): void{}

  onCheckbox ($event): void {
    console.log($event);
  }

}
