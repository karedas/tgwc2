import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tg-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {



  menuItems: MenuItem[];
  constructor(
    private game: GameService
  ) {
  }

  ngOnInit() {

    this.menuItems = [{
      label: 'Gioco',
      items: [
        { label: 'Log di gioco' },
        { label: 'Preferenze' },
        {
          label: 'Disconnetti', icon: "pi pi-fw pi-sign-out", command: (onclick) => {
            this.disconnect();
          }
        }
      ]
    },
    {
      label: 'Preferenze',
      icon: 'pi pi-fw pi-pencil',
      items: [
        { label: 'Delete', icon: 'pi pi-fw pi-trash' },
        { label: 'Refresh', icon: 'pi pi-fw pi-refresh' }
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
    }]
  }

  disconnect() {
    this.game.disconnectGame();
  }


}