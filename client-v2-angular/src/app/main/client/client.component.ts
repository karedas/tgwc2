import { Component, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { CookieService } from 'ngx-cookie-service';
// import { PreloaderService } from '../common/services/preloader.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WindowsService } from './windows/windows.service';

@Component({
  selector: 'tg-client',
  templateUrl: './client.component.html',
})

export class ClientComponent implements OnDestroy {

  preloaded = false;
  // preloadPerc: any;
  isCookieAccepted = false;

  private _unsubscribeAll = new Subject();

  constructor(
    private cookieService: CookieService,
    private platform: Platform,
    // private preloader: PreloaderService,
    private windowsService: WindowsService,
    @Inject(DOCUMENT) private document: any
  ) {


    /* Add a class to the Body Dom Element client if is loads in a Mobile device. */
    if (this.platform.ANDROID || this.platform.IOS) {
      this.document.body.className += 'is-mobile';
    }

    this._unsubscribeAll = new Subject();
  }

  // Cookie Law Behaviour
  showCookieLaw() {
    this.windowsService.openCookieLaw().pipe(
      takeUntil(this._unsubscribeAll))
      .subscribe((accept: boolean) => {
        this.isCookieAccepted = accept;
      });
  }

  clientIsReady(event) {

    this.preloaded = event;

    
    if (!this.cookieService.check('tgCookieLaw')) {
      setTimeout(() => {
        this.windowsService.openCookieLaw().pipe(
          takeUntil(this._unsubscribeAll)).subscribe((accept: boolean) => {
            this.isCookieAccepted = accept;
          });
      }, 100);
    } else {
      this.isCookieAccepted = true;
    }
  }

  onCookieAccepted(status: boolean) {
    this.isCookieAccepted = status;
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

