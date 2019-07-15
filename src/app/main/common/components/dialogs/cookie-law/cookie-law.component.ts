import { Component , Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'tg-cookie-law',
  templateUrl: './cookie-law.component.html',
  styleUrls: ['./cookie-law.component.scss'],
})

export class CookieLawComponent {

  @Output() iAcceptCookie: EventEmitter<boolean> = new EventEmitter();
  showButton = false;

  constructor(
    private dialogRef: MatDialogRef<CookieLawComponent>,
    private cookieService: CookieService,
    ) {
    }


  onContinue() {
    this.cookieService.set('tgCookieLaw', '1', 365, '/');
    this.dialogRef.close();
  }

  onFocus() {
  }

}