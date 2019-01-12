import { Component, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ModalConfiguration } from 'src/app/models/client/modal.interface';
import { ModalsService } from 'src/app/directives/modal/modal.service';

@Component ({
  selector: 'tg-cookie-law',
  templateUrl: './cookie-law.component.html',
  styleUrls: ['./cookie-law.component.scss']
})

export class CookieLawComponent implements AfterViewInit {

  @Output() iAcceptCookie: EventEmitter<boolean> = new EventEmitter();

  modalId: string = 'cookieLaw';
  modalConfig: ModalConfiguration;

  display = false;
  showButton = false;
  constructor(private cookieService: CookieService, private modalService: ModalsService) {
    this.modalConfig = {
      width: 420,
      height: 'auto',
      resizable: false,
      showCloseButton: false
    }
  }

  ngAfterViewInit(): void {
    this.modalService.open(this.modalId);
  }

  showDialog() {
    this.display = true;
  }

  onContinue() {
    this.cookieService.set('tgCookieLaw', '1');
    this.iAcceptCookie.emit(true);
    this.modalService.close(this.modalId);
  }

  toggle(): void {
    this.showButton = !this.showButton;
  }


}
