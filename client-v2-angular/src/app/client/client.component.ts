import { Component, Inject, Input, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { CookieService } from 'ngx-cookie-service';
import { GameService } from '../services/game.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'tg-client',
  templateUrl: './client.component.html',
})

export class ClientComponent implements OnInit{

  @Input('state') gameState$;

  isCookieAccepted: boolean = false;

  constructor(
    private cookieService: CookieService,
    private platform: Platform,
    private loginService: LoginService,
    private game: GameService,
    @Inject(DOCUMENT) private document: any
    ) {

    /* Add a class to the Body Dom Element client if is loads in a Mobile device. */
    if (this.platform.ANDROID || this.platform.IOS) {
      this.document.body.className += 'is-mobile';

    }
  }
  
  ngOnInit() {
    /* Mndatory verification of acceptance of the use of cookies before proceed */
    if(this.cookieService.check('tgCookieLaw')) {  this.isCookieAccepted = true; }

    /** Until Login Auth */
    this.loginService.isLoggedIn$.subscribe( auth => {
        if(auth) this.game.startGame();
      }
    );

    
  }

  onCookieAccepted(status: boolean) {
    this.isCookieAccepted = status;
  }
}

