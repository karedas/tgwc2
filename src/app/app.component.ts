import { Component, Inject, Renderer2, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints, MediaMatcher, BreakpointState } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

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
  matcher: MediaQueryList;

  private mediaQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    public mediaMatcher: MediaMatcher,
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
    console.log(event);
    this.assetsLoaded = event;
  }

  ngOnDestroy(): void {
    this.mediaQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
