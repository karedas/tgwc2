import { Component, ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'tg-client-container',
  templateUrl: './client-container.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientContainerComponent {

  showClient: boolean = false;

  constructor() {}

  goToClient() {
    this.showClient = !this.showClient;
  }
}
