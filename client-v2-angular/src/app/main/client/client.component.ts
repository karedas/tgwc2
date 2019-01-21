import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { CookieService } from 'ngx-cookie-service';
import { PreloaderService } from '../common/services/preloader.service';

@Component({
  selector: 'tg-client',
  templateUrl: './client.component.html',
})

export class ClientComponent {

  preloadAssetsStatus = false;
  preloadPerc: any;
  isCookieAccepted = false;

  constructor(
    private cookieService: CookieService,
    private platform: Platform,
    private preloader: PreloaderService,
    @Inject(DOCUMENT) private document: any
  ) {
    /* Add a class to the Body Dom Element client if is loads in a Mobile device. */
    if (this.platform.ANDROID || this.platform.IOS) {
      this.document.body.className += 'is-mobile';
    }

    //TODO: moves in a separate component for better implementation
    const percentageSubscribe = this.preloader.percentage.subscribe(
      amount => { this.preloadPerc = amount; }
    );

    const statusSubscribe = this.preloader.status$.subscribe(
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

  private gameIsReady() {

    /* Mndatory verification of acceptance of the use of cookies before proceed */
    if (this.cookieService.check('tgCookieLaw')) { 
      this.isCookieAccepted = true; 
    }
  }

  onCookieAccepted(status: boolean) {
    this.isCookieAccepted = status;
  }
}

