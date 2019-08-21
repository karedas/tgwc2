import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { NavigationItem, baseNavigationSidebar, gameNavigationSideBar } from '../navigation';
import { Router, Event, NavigationEnd } from '@angular/router';
import { LoginClientService } from 'src/app/main/client/services/login-client.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'tg-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit {
  @Output() itemClick: EventEmitter<any> = new EventEmitter<any>();
  
  public baseLinks: NavigationItem[] = [];
  public gameItems: NavigationItem[] = [];
  public baseItems: NavigationItem[] = [];
  public selectedItem = 0;
  public userIsLoggedIn: boolean;
  public userIsInGame = false;

  constructor(
    private loginClientService: LoginClientService,
    private router: Router,
    private authService: AuthService
    ) {

    this.router.events
      .subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
          this.userIsLoggedIn = this.authService.userIsLoggedIn();
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
    
  }

  isEnableFor(level: string): boolean {
    return true;
  }
}
