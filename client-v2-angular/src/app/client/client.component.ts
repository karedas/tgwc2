import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { GameService } from '../services/game.service';
import { CookieService } from 'ngx-cookie-service';
 

@Component({
  selector: 'tg-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit{

  isCookieAccepted: boolean = false;

  constructor(
    private game: GameService,
    private cookieService: CookieService,
    private platform: Platform,
    @Inject(DOCUMENT) private document: any
  ) {
    /* Add a class to the Body Dom Element client if is loads in a Mobile device. */
    if (this.platform.ANDROID || this.platform.IOS) {
      this.document.body.className += 'is-mobile';
    }
  }

  ngOnInit() {
    /* Mndatory verification of acceptance of the use of cookies before proceed */
    if(!this.cookieService.check('tgCookieLaw')) {
      return;
    }
    else {
      this.game.run();
      this.isCookieAccepted = true;
    }
  }

  onCookieAccepted(status: boolean) {
    this.isCookieAccepted = status;
  }
}

