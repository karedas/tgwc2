import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';
import { GameService } from 'src/app/services/game.service';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { getDateTime } from 'src/app/store/selectors';

import gitInfo from 'src/git-version.json';
import { IDateTime } from 'src/app/models/data/dateTime.model';


@Component({

  selector: 'tg-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {

  gitVersion = gitInfo.raw;
  menuItems: MenuItem[];

  
  constructor(
    private store: Store<DataState>,   
    private game: GameService
  ) {
  }

  ngOnInit() {

    this.menuItems = [{
      label: 'Gioco',
      items: [
        { label: 'Log di gioco', disabled: true},
        { label: 'Preferenze', disabled: true},
        {
          label: 'Disconnetti', icon: 'pi pi-fw pi-sign-out', separator: false, command: (onclick) => {
            this.disconnect();
          }
        }
      ]
    },
    {
      label: 'Guida',
      icon: 'pi pi-fw pi-pencil',
      items: [
        { label: 'Guida al gioco', disabled: true },
        { label: 'Ultime Novità di gioco', disabled: true },
        { label: 'Note di rilascio Webclient', disabled: true },
        { label: 'Segnala un problema', disabled: true },
        { label: 'Tasti rapidi', disabled: true },
        { label: 'Forum', disabled: true },
        { label: 'Informazioni su The Gate', disabled: true },
      ]
    }];
  }



  disconnect() {
    this.game.disconnectGame();
  }


}
