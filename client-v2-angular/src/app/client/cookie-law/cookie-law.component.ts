import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component ({
  selector: 'tg-cookie-law',
  templateUrl: './cookie-law.component.html',
  styleUrls: ['./cookie-law.component.scss']
})

export class CookieLawComponent {

  @Output() iAcceptCookie: EventEmitter<boolean> = new EventEmitter();

  display: boolean = false;
  showButton = false;

  constructor(private cookieService: CookieService) {
  }

  showDialog() {
    this.display = true;
  }

  onContinue() {
    this.cookieService.set('tgCookieLaw', '1');
    this.iAcceptCookie.emit(true);
  }

  toggle(): void {
    this.showButton = !this.showButton;
  }

}
