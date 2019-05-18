import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

declare let ga: Function;

@Component({
  selector: 'tg-root',
  template: `
    <tg-splashscreen id="splashscreen" (loaded)="onLoad($event)"></tg-splashscreen>
    <tg-main *ngIf="load"></tg-main>
    `,
  // template: `
  //   <tg-main></tg-main>ng
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

  constructor(
    private router: Router,
    ) {

    // subscribe to router events and send page views to Google Analytics
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });

  }

  onLoad(event: boolean): void {
    this.load = event;
  }
}
