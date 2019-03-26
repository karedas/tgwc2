import { Component, OnDestroy, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Platform } from '@angular/cdk/platform';
import { WindowsService } from './client/windows/windows.service';
import { DOCUMENT } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tg-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnDestroy {

  public preloaded = false;
  public isCookieAccepted = false;
  private _unsubscribeAll = new Subject();

  constructor(
    private cookieService: CookieService,
    private platform: Platform,
    private windowsService: WindowsService,
    @Inject(DOCUMENT) private document: any
  ) {
    /* Add a class to the Body Dom Element client if is loads in a Mobile device. */
    if (this.platform.ANDROID || this.platform.IOS) {
      this.document.body.className += ' is-mobile';
    }

    this._init();
    this._unsubscribeAll = new Subject();

  }

  _init() {
    if (!this.cookieService.check('tgCookieLaw')) {
      setTimeout(() => {
        this.showCookieLaw();
      });
    } else {
      this.start();
    }
  }


  // Cookie Law Behaviour
  showCookieLaw() {
    this.windowsService.openCookieLaw()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((accept: boolean) => {
        this.start();
      });
  }


  onCookieAccepted(status: boolean) {
    this.isCookieAccepted = status;
  }

  start() {
    this.isCookieAccepted = true;
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}