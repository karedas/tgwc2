import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { Observable } from 'rxjs';
import { IHero } from 'src/app/main/client/models/data/hero.model';
import { getHero } from 'src/app/store/selectors';
import { GameService } from 'src/app/main/client/services/game.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'tg-character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CharacterSheetComponent  {

  dialogID = 'charactersheet';
  closed = true;
  imagepath: string = environment.media_address;

  heroBase$: Observable<IHero>;

  public heroImageUrl: string;
  public heroName: string;
  public heroTitle: string;

  public openedTab = '';

  constructor(
    private store: Store<DataState>,
    private game: GameService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.heroBase$ = this.store.pipe(select(getHero));
  }

  switchPanel(tab: string, event: Event) {

    event.stopPropagation();
    event.stopImmediatePropagation();

    switch (tab) {
      case 'info':
        this.game.client_update.invOpen = false;
        this.game.client_update.equipOpen  = false;
        this.game.processCommands('info');
      break;
      case 'equip':
        this.game.processCommands('equip');
      break;
      case 'inventory':
        this.game.processCommands('inventario');
      break;
      case 'skills':
        this.game.client_update.invOpen = false;
        this.game.client_update.equipOpen  = false;
        this.game.processCommands('abilita');
      break;
    }
  }
}