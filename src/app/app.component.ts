import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

declare let ga: Function;

@Component({
  selector: 'tg-root',
  template: `
  <tg-splashscreen
    *ngIf="!debug && !assetsLoaded"
    id="splashscreen"
    (loaded)="onLoad($event)"></tg-splashscreen>

  <tg-main *ngIf="assetsLoaded"></tg-main>
  `,
  styles: [`
  :host {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    min-width: 0;
  `]
})

export class AppComponent implements OnDestroy {

  debug = false;
  title = 'The Gate v2 WebClient';

  assetsLoaded = false;
  constructor(
    private router: Router,
    private cookieService: CookieService,
    public breakpointObserver: BreakpointObserver,
    private render: Renderer2,
    @Inject(DOCUMENT) private document: any
  ) {


    if (!environment.production) {
      this.debug = false;
    }

    // subscribe to router events and send page views to Google Analytics
    this.router.events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (this.cookieService.check('tgookieLaw')) {
            ga('set', 'page', event.urlAfterRedirects);
            ga('send', 'pageview');
          }
        }
      });

    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.render.addClass(this.document.body, 'xs');
        } else {
          this.render.removeClass(this.document.body, 'xs');
        }
      });
  }

  onLoad(event: boolean): void {
    this.assetsLoaded = event;
  }

  ngOnDestroy(): void {
  }
}
