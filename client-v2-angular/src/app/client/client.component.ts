import { Component, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { CookieService } from 'ngx-cookie-service';
import { GameService } from '../services/game.service';
import { LoginService } from '../authentication/services/login.service';
import { PreloaderService } from './common/services/preloader.service';

@Component({
  selector: 'tg-client',
  templateUrl: './client.component.html',
})

export class ClientComponent {

  @Input('state') gameState$;
  preloadAssetsStatus = false;
  preloadPerc: any;
  isCookieAccepted = false;

  constructor(
    private cookieService: CookieService,
    private platform: Platform,
    private loginService: LoginService,
    private game: GameService,
    private preloader: PreloaderService,
    @Inject(DOCUMENT) private document: any
  ) {
    /* Add a class to the Body Dom Element client if is loads in a Mobile device. */
    if (this.platform.ANDROID || this.platform.IOS) {
      this.document.body.className += 'is-mobile';
    }

    this.preloader.percentage.subscribe(
      amount => { this.preloadPerc = amount; }
    );

    this.preloader.status$.subscribe(
      status => {
        if (status == true) {
          this.preloadAssetsStatus = status;
          this.gameIsReady();
        }
      }
    );
  }

  private gameIsReady() {

    /* Mndatory verification of acceptance of the use of cookies before proceed */
    if (this.cookieService.check('tgCookieLaw')) { this.isCookieAccepted = true; }

    /** Until Login Auth */
    this.loginService.isLoggedIn$.subscribe(auth => {
      if (auth) { this.game.startGame(); }
    });
  }

  onCookieAccepted(status: boolean) {
    this.isCookieAccepted = status;
  }
}

