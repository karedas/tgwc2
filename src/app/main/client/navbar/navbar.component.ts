// import { Component, ViewEncapsulation, OnInit } from '@angular/core';
// import { GameService } from 'src/app/main/client/services/game.service';
// import gitInfo from 'src/git-version.json';

// import { faFont } from '@fortawesome/free-solid-svg-icons';
// import { DialogV2Service } from '../../common/dialog-v2/dialog-v2.service';


// @Component({

//   selector: 'tg-navbar',
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.scss'],
//   encapsulation: ViewEncapsulation.None
// })
// export class NavbarComponent implements OnInit {

//   gitVersion = gitInfo.raw;
//   // menuItemsLeft: MenuItem[];
//   // menuItemsRight: MenuItem[];

//   faFont = faFont;



//   constructor(
//     private game: GameService,
//     // private dialogV2Service: DialogV2Service
//   ) {
//   }

//   ngOnInit() {

//     // this.menuItemsLeft = [{
//     //   label: 'Client',
//     //   items: [
//     //     { label: 'Log di gioco', disabled: true },
//     //     { label: 'Preferenze', command: (onclick) => {
//     //       this.dialogV2Service.openNews();
//     //     }},
//     //     {
//     //       label: 'Disconnetti', icon: 'pi pi-fw pi-sign-out', separator: false, command: (onclick) => {
//     //         this.game.disconnectGame();
//     //       }
//     //     }
//     //   ]
//     // },
//     // {
//     //   label: 'Gioco',
//     //   items: [
//     //     {
//     //       label: 'Lista completa dei comandi', command: (onclick) => {
//     //         this.game.processCommands('comandi');
//     //       }
//     //     }
//     //   ]
//     // },
//     // {
//     //   label: 'Guida',
//     //   icon: 'pi pi-fw pi-pencil',
//     //   items: [
//     //     { label: 'Guida al gioco', disabled: true },
//     //     {
//     //       label: 'Ultime novità', disabled: true, command: (onclick) => {
//     //         // this.windowsService.openNews();
//     //       }
//     //     },
//     //     { label: 'Segnala un problema', url: 'http://forum.thegatemud.it/viewforum.php?f=51', target: '_blank' },
//     //     { label: 'Tasti rapidi', disabled: true },
//     //     { label: 'Forum', url: 'http://forum.thegatemud.it', target: '_blank' },
//     //     { label: 'Informazioni su The Gate', disabled: true },
//     //   ]
//     // }];


//     // this.menuItemsRight = [{
//     // }];


//   }
// }
