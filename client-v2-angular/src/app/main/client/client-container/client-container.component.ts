import { Component } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Store, select } from '@ngrx/store';
import { UIState } from 'src/app/store/state/ui.state';
import { WelcomeNewsAction } from 'src/app/store/actions/ui.action';
import { getWelcomeNews } from 'src/app/store/selectors';

@Component({
  selector: 'tg-client-container',
  templateUrl: './client-container.component.html',

})
export class ClientContainerComponent {
  
  showNews: boolean;
  constructor(private game: GameService, private store: Store<UIState>) {

    this.store.pipe(select(getWelcomeNews)).subscribe(
        showNews => this.showNews = showNews
    );
  }
}
