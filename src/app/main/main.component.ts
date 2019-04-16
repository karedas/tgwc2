import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/platform-browser';

import { DialogV2Service } from './common/dialog-v2/dialog-v2.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'tg-main',
  templateUrl: './main.component.html',
  styles: [`
    :host {
      height: 100%;
    }
  `]
})
export class MainComponent implements OnInit, OnDestroy {

  public preloaded = false;
  public isCookieAccepted = false;
  private _unsubscribeAll = new Subject();

  constructor(
    private cookieService: CookieService,
    private platform: Platform,
    public dialog: MatDialog,

    private dialogV2Service: DialogV2Service,


    @Inject(DOCUMENT) private document: any
  ) {
    
    /* Add a class to the Body Dom Element client if is loads in a Mobile device. */
    if (this.platform.ANDROID || this.platform.IOS) {
      this.document.body.className += ' is-mobile';
    }

    this._unsubscribeAll = new Subject();

  }

  ngOnInit(): void {
    
    setTimeout(() => {
      if (!this.cookieService.check('tgCookieLaw')) {
        this.dialogV2Service
          .openCookieLaw()
          .afterClosed()
            .subscribe(() => this.start());
      } else {
        this.start();
      }
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
