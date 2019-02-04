import { Component , Output, EventEmitter } from '@angular/core';
import { DynamicDialogRef } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'tg-cookie-law',
  templateUrl: './cookie-law.component.html',
  styleUrls: ['./cookie-law.component.scss'],
})

export class CookieLawComponent {

  @Output() iAcceptCookie: EventEmitter<boolean> = new EventEmitter();

  dialogID: string = 'cookielaw';
  showButton: boolean = false;

  constructor(private ref: DynamicDialogRef, private cookieService: CookieService) {}


  onContinue() {
    this.ref.close(true);
    this.cookieService.set('tgCookieLaw', '1');
  }
}
