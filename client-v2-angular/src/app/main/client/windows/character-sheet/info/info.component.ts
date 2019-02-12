import { Component, ViewChild, AfterViewInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { IHero } from 'src/app/models/data/hero.model';
import { DataState } from 'src/app/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { getHero } from 'src/app/store/selectors';
import { GameService } from 'src/app/services/game.service';
import { NgScrollbar } from 'ngx-scrollbar';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tg-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoComponent implements AfterViewInit {

  @ViewChild(NgScrollbar) textAreaScrollbar: NgScrollbar;
  
  heroInfo$: Observable<IHero>;
  description: string = '';

  constructor(
    private store: Store<DataState>,
    private game: GameService
  ) {
    this.heroInfo$ = this.store.pipe(select(getHero));
   }

  ngAfterViewInit() {
    this.heroInfo$.pipe(
      map(( hero:IHero ) => {
        console.log(hero);
        this.parseDesc(hero.desc);
        this.textAreaScrollbar.update();
      })).subscribe();
  }

    
  sendChangeDescriptionRequest() {
    this.game.processCommands('cambia desc');
  }

  parseDesc(value: string) {
    this.description = value.replace(/([.:?!,])\s*\n/gm, '$1').replace(/\r?\n|\r/g, '');
  }


}
