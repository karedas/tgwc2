import { Component, Inject, Renderer2, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints, MediaMatcher, BreakpointState } from '@angular/cdk/layout';
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
    width: 100%;
    height: 100%;
    min-width: 0;
    top:0;
    bottom:0;
    left:0;
    right:0;
  `]
})

export class AppComponent implements OnDestroy {

  title = 'The Gate v2 WebClient';
  load = false;
  matcher: MediaQueryList;

  private mediaQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    public mediaMatcher: MediaMatcher,
    private router: Router,
    public breakpointObserver: BreakpointObserver,
    private render: Renderer2,
    @Inject(DOCUMENT) private document: any
  ) {

    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.render.addClass(this.document.body, 'xs');
        } else {
          this.render.removeClass(this.document.body, 'xs');
        }
      });

    // subscribe to router events and send page views to Google Analytics
    this.router.events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          ga('set', 'page', event.urlAfterRedirects);
          ga('send', 'pageview');
        }
      });
  }

  onLoad(event: boolean): void {
    this.load = event;
  }

  ngOnDestroy(): void {
    this.mediaQuery.removeListener(this._mobileQueryListener);
  }
}
