import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { NavigationItem, baseNavigationSidebar, gameNavigationSideBar } from '../navigation';
import { Router, Event, NavigationEnd } from '@angular/router';
import { LoginClientService } from 'src/app/main/client/services/login-client.service';

@Component({
  selector: 'tg-sidenav-content',
  templateUrl: './sidenav-content.component.html',
  styleUrls: ['./sidenav-content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidenavContentComponent implements OnInit {
  @Output() itemClick: EventEmitter<any> = new EventEmitter<any>();
  
  public baseLinks: NavigationItem[] = [];
  public gameItems: NavigationItem[] = [];
  public baseItems: NavigationItem[] = [];
  public selectedItem = 0;
  public userIsInGame = false;

  constructor(
    private loginClientService: LoginClientService,
    private router: Router
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

  isEnableFor(level: string): boolean {
    return true;
  }
}