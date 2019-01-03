import { Component } from '@angular/core';
import { trigger, style, animate, transition, query } from '@angular/animations';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tg-quotes',
  template: `
  <div class="tg-intro-rotatext row text-center">
      <div class="col-12">
      <ng-container [@crossFadeQuote]>
        {{ (quotes[index$ | async])?.msg  }}
        <div class="auth">- {{ (quotes[index$ | async])?.author }} -</div>
      </ng-container>
      </div>
  </div>`,
  styleUrls: ['./quotes.component.scss'],

  animations: [
    trigger('crossFadeQuote', [

      transition( '* => *', [

          query(':enter',
              [
                  style({ opacity: 0 })
              ],
              { optional: true }
          ),

          query(':leave',
              [
                  style({ opacity: 1 }),
                  animate('0.2s', style({ opacity: 0 }))
              ],
              { optional: true }
          ),

          query(':enter',
              [
                  style({ opacity: 0 }),
                  animate('0.2s', style({ opacity: 1 }))
              ],
              { optional: true }
          )

      ]
      )
  ])]
})

export class QuotesComponent {
  quotes = [
    { show: true, author: `Anonimo`, msg: `L'importante non è Guardare, occorre Vedere`},
    { show: false, author: `Una guardia cittadina`, msg: `Nuovo giorno, buon giorno!`},
    { show: false, author: `Strane creature di Ikhari`, msg: `Gnek gnek!` }
  ];

  index$: Observable<number>;

  constructor() {

    this.index$ = interval(4500).pipe(
      map((item, index) => index % this.quotes.length)
    );
  }

  showQuote(i) {

  }
}