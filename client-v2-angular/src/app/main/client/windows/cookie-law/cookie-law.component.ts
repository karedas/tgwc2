import { Component} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { MatDialogRef} from "@angular/material";

@Component ({
  selector: 'tg-cookie-law',
  templateUrl: './cookie-law.component.html',
  styleUrls: ['./cookie-law.component.scss'],
})

export class CookieLawComponent {

  showButton = false;
  checked = false;

  constructor(
    private cookieService: CookieService, 
    private dialogRef: MatDialogRef<CookieLawComponent>,  
  ) {

  }

  onContinue() {
    this.cookieService.set('tgCookieLaw', '1');
    this.dialogRef.close();
  }

  toggle(): void {
    this.showButton = !this.showButton;
  }
}
