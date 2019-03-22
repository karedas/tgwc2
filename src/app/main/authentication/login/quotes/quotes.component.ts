import { Component } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'tg-quotes',
  template: `
  <div class="tg-intro-rotatext" fxLayout="column" fxLayoutAlign="center center">
    <div *ngFor="let quote of quotesList;" [@quotesFadeInOut]="quote.show" class="phrase">
    {{ quote.msg  }}
    <div class="auth">- {{ quote.author }} -</div>
    </div>
  </div>`,
  styleUrls: ['./quotes.component.scss'],
  animations: [
    trigger('quotesFadeInOut', [
      state('true', style({opacity: 1})),
      transition('false => true', [
        animate('.5s')
      ]),
      transition('true => false', [
        animate('.8s')
      ]),
    ])
  ]
})

export class QuotesComponent {

  quotesList = [
    { show: true, author: `Anonimo`, msg: `L'importante non è Guardare, occorre Vedere`},
    { show: false, author: `Una guardia cittadina`, msg: `Nuovo giorno, buon giorno!`},
    { show: false, author: `Strane creature di Ikhari`, msg: `Gnek gnek!` }
  ];
  
  lastIndex: number = 0;

  index$: Observable<number> = new Observable();

  constructor() {

    this.index$ = timer(0, 4500);
    this._init();

  }

  _init() {
    this.index$.pipe(
      map((item, index: number) => { return index % this.quotesList.length })
    ).subscribe(i => {
      this.quotesList[this.lastIndex].show = false;
      this.quotesList[i].show = !this.quotesList[i].show;
      this.lastIndex = i;
    });
  }
}
