import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  // template: `<tg-client [state]="gameState$ | async"></tg-client>`,
  template: `<tg-client></tg-client>`,
})

export class AppComponent {
  title = 'The Gate v2 WebClient';
  constructor() {
  }
}
