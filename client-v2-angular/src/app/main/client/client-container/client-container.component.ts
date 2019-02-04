import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'tg-client-container',
  templateUrl: './client-container.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ClientContainerComponent {

  showClient: boolean = false;

  constructor() {}

  goToClient() {
    this.showClient = !this.showClient;
  }
}
