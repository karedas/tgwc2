import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { NavigationItem, baseNavigationSidebar, gameNavigationSideBar } from '../navigation';
import { Router, Event, NavigationEnd } from '@angular/router';
import { DispenserService } from 'src/app/main/client/services/dispenser.service';
import { LoginClientService } from 'src/app/main/authentication/services/login-client.service';

@Component({
  selector: 'tg-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit {
  @Output() itemClick: EventEmitter<any> = new EventEmitter<any>();

  public gameItems: NavigationItem[] = [];
  public baseItems: NavigationItem[] = [];
  public selectedItem = 0;
  public userIsInGame = false;

  constructor(
    private loginClientService: LoginClientService,
    private router: Router,
    private dispenserService: DispenserService
    ) {

    this.router.events
      .subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
          this.userIsInGame = this.loginClientService.isInGame;
        }
      });
  }

  ngOnInit() {
    this.createMenu();
  }

  /* Private Method */
  private createMenu() {

    for (const item in gameNavigationSideBar) {
      if (gameNavigationSideBar.hasOwnProperty(item)) {
        this.gameItems.push(gameNavigationSideBar[item]);
      }
    }

    for (const item in baseNavigationSidebar) {
      if (baseNavigationSidebar.hasOwnProperty(item)) {
        this.baseItems.push(baseNavigationSidebar[item]);
      }
    }
  }

  toggleSidenav() {
    this.itemClick.emit();
  }

  /* Public Method */
  selectItmeMenu(i) {
    this.selectedItem = i;
  }

  onActionClick(what: string) {
    this.dispenserService.do(what);
    this.toggleSidenav();
  }

  isEnableFor(level: string): boolean {
    return true;
  }
}
