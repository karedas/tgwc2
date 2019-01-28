import { Component, Output, EventEmitter, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DialogService } from 'src/app/main/common/dialog/dialog.service';
import { ModalConfiguration } from 'src/app/main/common/dialog/model/modal.interface';

@Component ({
  selector: 'tg-cookie-law',
  templateUrl: './cookie-law.component.html',
  styleUrls: ['./cookie-law.component.scss'],
})

export class CookieLawComponent implements AfterViewInit {

  @Output() iAcceptCookie: EventEmitter<boolean> = new EventEmitter();

  dialogID = 'cookieLaw';
  modalConfig: ModalConfiguration = new ModalConfiguration;
  display = false;
  showButton = false;

  constructor(private cookieService: CookieService, private dialogService: DialogService) {
    this.modalConfig = {
      width: 420,
      height: 'auto',
      resizable: false,
      showCloseButton: false
    };
  }

  ngAfterViewInit(): void {
    this.dialogService.open(this.dialogID);
  }

  showDialog() {
    this.display = true;
  }

  onContinue() {
    this.cookieService.set('tgCookieLaw', '1');
    this.iAcceptCookie.emit(true);
    this.dialogService.close(this.dialogID);
  }

  toggle(): void {
    this.showButton = !this.showButton;
  }


}
