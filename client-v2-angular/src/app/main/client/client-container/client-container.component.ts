import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { UIState } from 'src/app/store/state/ui.state';
import { getWelcomeNews } from 'src/app/store/selectors';

@Component({
  selector: 'tg-client-container',
  templateUrl: './client-container.component.html',

})
export class ClientContainerComponent {
  
  showNews: boolean;
  constructor(private store: Store<UIState>) {

    this.store.pipe(select(getWelcomeNews)).subscribe(
        showNews => this.showNews = showNews
    );
  }
}
