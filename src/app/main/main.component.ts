import { Component, OnDestroy, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';

import { DialogService as DynamicDialogService, DynamicDialogConfig } from 'primeng/api';
import { CookieLawComponent } from './client/windows/cookie-law/cookie-law.component';

@Component({
  selector: 'tg-main',
  templateUrl: './main.component.html',
  styles: [`
    :host {
      height: 100%;
    }
  `]
})
export class MainComponent implements OnDestroy {

  public preloaded = false;
  public isCookieAccepted = false;
  private _unsubscribeAll = new Subject();

  constructor(
    private cookieService: CookieService,
    private platform: Platform,
    private dynamicDialogService: DynamicDialogService,
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
      this.showCookieLaw();
    } else {
      this.start();
    }
  }

  // Cookie Law Behaviour
  showCookieLaw() {
    
    setTimeout(() => {
      const ref = this.dynamicDialogService.open(CookieLawComponent,
        <DynamicDialogConfig>{
          showHeader: false,
          closeOnEscape: false,
          styleClass: 'tg-dialog',
          width: '450px',
          height: 'auto',
          style: { 'max-width': '100%', 'max-height': '100%' },
          contentStyle: { 'max-height': '100%', 'max-width': '100%', 'overflow': 'auto' }
        });

      ref.onClose.subscribe(() => {
        this.start();
      });
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