import { Component, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';

declare let ga: Function;

@Component({
  selector: 'tg-root',
  template: ` <tg-main></tg-main>`,
  // <tg-splashscreen id="splashscreen" (loaded)="onLoad($event)"></tg-splashscreen>
  // <tg-main *ngIf="load"></tg-main>
  // template: `
  //   `,
  styles: [`
  :host {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    min-width: 0;
    flex-direction:column;
    top:0;
    bottom:0;
    left:0;
    right:0;
  `]
})

export class AppComponent {

  title = 'The Gate v2 WebClient';
  load = false;
  matcher: MediaQueryList;

  private mediaQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    public mediaMatcher: MediaMatcher,
    private router: Router,
    private platform: Platform,
    public breakpointObserver: BreakpointObserver,
    @Inject(DOCUMENT) private document: any
  ) {

    this.matcher = this.mediaMatcher.matchMedia(Breakpoints.XSmall);
    this.matcher.addListener(this.breakpointsListener);

    // subscribe to router events and send page views to Google Analytics
    this.router.events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          ga('set', 'page', event.urlAfterRedirects);
          ga('send', 'pageview');
        }
      });
  }

  private breakpointsListener(event) {
    this.document.body.className += ' is-mobile';
  }

  onLoad(event: boolean): void {
    this.load = event;
  }

  ngOnDestroy(): void {
    this.mediaQuery.removeListener(this._mobileQueryListener);
  }
}
