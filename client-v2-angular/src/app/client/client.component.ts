import { Component, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'tg-client',
  templateUrl: './client.component.html',
})

export class ClientComponent{

  @Input('state') gameState$;

  isCookieAccepted: boolean = false;

  constructor(
    private cookieService: CookieService,
    private platform: Platform,
    private router: Router,
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
      this.isCookieAccepted = true;
      this.router.navigate(['login']);
    }
  }

  onCookieAccepted(status: boolean) {
    this.isCookieAccepted = status;
  }
}

