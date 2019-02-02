import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DialogService } from 'src/app/main/common/dialog/dialog.service';

@Component({
  selector: 'tg-cookie-law',
  templateUrl: './cookie-law.component.html',
  styleUrls: ['./cookie-law.component.scss'],
})

export class CookieLawComponent implements AfterViewInit {

  @Output() iAcceptCookie: EventEmitter<boolean> = new EventEmitter();

  dialogID: string = 'cookielaw';
  showButton: boolean = false;

  constructor(
    private cookieService: CookieService,
    private dialogService: DialogService
  ) {

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dialogService.open(this.dialogID, {
        width: '450px',
        height: 'auto',
        modal: true
      });

    });

  }


  onContinue() {
    this.dialogService.close(this.dialogID);
    this.cookieService.set('tgCookieLaw', '1');

    setTimeout(() => {
      this.iAcceptCookie.emit(true);
    }, 500);
  }

}
