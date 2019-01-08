import { Component, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { jqxWindowComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';

@Component ({
  selector: 'tg-cookie-law',
  templateUrl: './cookie-law.component.html',
  styleUrls: ['./cookie-law.component.scss']
})

export class CookieLawComponent implements AfterViewInit {

  @ViewChild('windowReference') windowCookieLaw: jqxWindowComponent;
  //@ViewChild('jqxWidget') cookieLawReference: ElementRef;
  @Output() iAcceptCookie: EventEmitter<boolean> = new EventEmitter();

  display = false;
  showButton = false;
  constructor(private cookieService: CookieService) {
  }

  ngAfterViewInit(): void {
    this.windowCookieLaw.open();
  }

  showDialog() {
    this.display = true;
  }

  onContinue() {
    this.cookieService.set('tgCookieLaw', '1');
    this.iAcceptCookie.emit(true);
    this.windowCookieLaw.destroy();
  }

  toggle(): void {
    this.showButton = !this.showButton;
  }


}
