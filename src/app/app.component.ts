import { Component } from '@angular/core';
@Component({
  selector: 'tg-root',
  // template: `<tg-client [state]="gameState$ | async"></tg-client>`,
  template: `<tg-client fxLayout="column" fxFlexFill class="min-h-0"></tg-client>`,
  styles: [`:host {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    min-width: 0;`]
})

export class AppComponent {
  title = 'The Gate v2 WebClient';
}
