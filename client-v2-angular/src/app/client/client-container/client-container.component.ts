import { Component, Input } from '@angular/core';
import { PreloaderService } from 'src/app/services/preloader.service';

@Component({
  selector: 'tg-client-container',
  templateUrl: './client-container.component.html',

})

export class ClientContainerComponent {
  constructor(private preloadService: PreloaderService){
    preloadService.load();
  }
}
