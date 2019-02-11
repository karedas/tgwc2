import { Component, ChangeDetectionStrategy, OnInit, ViewEncapsulation, Input, AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { Observable } from 'rxjs';
import { IHero } from 'src/app/models/data/hero.model';
import { getHero } from 'src/app/store/selectors';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tg-character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterSheetComponent implements OnInit {

  dialogID: string = 'charactersheet';
  imagepath: string = environment.media_address;
  
  heroBase$: Observable<IHero>;
  public heroImageUrl: string;
  public heroName: string;
  public heroTitle: string;

  public openedTab: string = '';

  constructor(
    private store: Store<DataState>,
    private game: GameService
  ) {

    this.heroBase$ = this.store.pipe(select(getHero));
  }

  ngOnInit(): void {

  }

  onRequest(data) {
    if(data !== this.openedTab) {
      this.openedTab = data;
    }
  }

  switchPanel(tab: string) {
    switch(tab) {
      case 'info':
        this.game.processCommands('info');
      break;
      case 'eqinv':
        this.game.processCommands('equip; invent');
      break;
      case 'skills':
        this.game.processCommands('abilita');
      break;
    }
    this.openedTab = tab;
  }
}
