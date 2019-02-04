import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { CookieService } from 'ngx-cookie-service';
import { PreloaderService } from '../common/services/preloader.service';
import { DialogService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CookieLawComponent } from './windows/cookie-law/cookie-law.component';

@Component({
  selector: 'tg-client',
  templateUrl: './client.component.html',
})

export class ClientComponent implements OnInit, OnDestroy {

  preloadAssetsStatus = false;
  preloadPerc: any;
  isCookieAccepted = false;

  private _unsubscribeAll = new Subject();


  constructor(
    private cookieService: CookieService,
    private platform: Platform,
    private preloader: PreloaderService,
    private dialogService: DialogService,
    @Inject(DOCUMENT) private document: any
  ) {


    /* Add a class to the Body Dom Element client if is loads in a Mobile device. */
    if (this.platform.ANDROID || this.platform.IOS) {
      this.document.body.className += 'is-mobile';
    }

    this._unsubscribeAll = new Subject();

  }

  ngOnInit(): void {

    // TODO: moves in a separate component for better implementation
    const percentageSubscribe = this.preloader.percentage
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        amount => { this.preloadPerc = amount; }
      );


    const statusSubscribe = this.preloader.status$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        status => {
          if (status == true) {
            this.preloadAssetsStatus = status;
            this.gameIsReady();
            percentageSubscribe.unsubscribe();
            statusSubscribe.unsubscribe();
          }
        }
      );
  }

  // Cookie Law Behaviour
  showCookieLaw() {
    setTimeout(() => {
      const ref = this.dialogService.open(CookieLawComponent, {
        showHeader: false,
        closeOnEscape: false,
        contentStyle: {'max-height': '450px', 'overflow': 'auto'}
      });

      ref.onClose.subscribe(() => {
        this.isCookieAccepted = true;
      } );

    }, 100);
  }

  private gameIsReady() {
    if (!this.cookieService.check('tgCookieLaw')) {
      this.showCookieLaw();
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

