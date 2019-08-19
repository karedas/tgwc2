import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationItem, baseNavigationSidebar, gameNavigationSideBar } from '../navigation';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'tg-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {
  public baseLinks: NavigationItem[] = [];
  public gameItems: NavigationItem[] = [];
  public baseItems: NavigationItem[] = [];
  public selectedItem = 0;
  public currentUser: User;

  constructor(
    private authService: AuthService
    ) {
    this.currentUser = this.authService.currentUser;
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


  /* Public Method */
  selectItmeMenu(i) {
    this.selectedItem = i;
  }

  isEnableFor(level: string): boolean {
    return true;
  }
}
