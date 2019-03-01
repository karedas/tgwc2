import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';
import { GameService } from 'src/app/services/game.service';
import gitInfo from 'src/git-version.json';
import { WindowsService } from '../windows/windows.service';


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
    private game: GameService,
    private windowsService: WindowsService
  ) {
  }

  ngOnInit() {

    this.menuItems = [{
      label: 'Client',
      items: [
        { label: 'Log di gioco', disabled: true },
        { label: 'Preferenze', disabled: true },
        {
          label: 'Disconnetti', icon: 'pi pi-fw pi-sign-out', separator: false, command: (onclick) => {
            this.game.disconnectGame();
          }
        }
      ]
    },
    {
      label: 'Gioco',
      items: [
        {
          label: 'Lista completa dei comandi', command: (onclick) => {
            this.game.processCommands('comandi');
          }
        }
      ]
    },
    {
      label: 'Guida',
      icon: 'pi pi-fw pi-pencil',
      items: [
        { label: 'Guida al gioco', disabled: true },
        {
          label: 'Ultime novità', disabled: true, command: (onclick) => {
            this.windowsService.openWelcomeNews();
          }
        },
        { label: 'Segnala un problema', disabled: true },
        { label: 'Tasti rapidi', disabled: true },
        { label: 'Forum', url: 'http://forum.thegatemud.it', target: '_blank' },
        { label: 'Informazioni su The Gate', disabled: true },
      ]
    }];
  }
}
