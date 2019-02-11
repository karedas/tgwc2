import { Component, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { IHero } from 'src/app/models/data/hero.model';
import { DataState } from 'src/app/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { getHero } from 'src/app/store/selectors';
import { GameService } from 'src/app/services/game.service';
import { NgScrollbar } from 'ngx-scrollbar';

@Component({
  selector: 'tg-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InfoComponent implements AfterViewInit {

  @ViewChild(NgScrollbar) textAreaScrollbar: NgScrollbar;
  
  heroInfo$: Observable<IHero>;

  constructor(
    private store: Store<DataState>,
    private game: GameService
  ) {
    this.heroInfo$ = this.store.pipe(select(getHero));
   }

  ngAfterViewInit() {
    this.textAreaScrollbar.update();
  }

    
  sendChangeDescriptionRequest() {
    this.game.processCommands('cambia desc');
  }

  parseDesc(value: string): string {
    return value.replace(/([.:?!,])\s*\n/gm, '$1').replace(/\r?\n|\r/g, '');
  }


}
