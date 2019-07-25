import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { navigationSidebar, NavigationItem, baseNavigationSidebar } from '../navigation';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';
import { Navigation } from 'selenium-webdriver';

@Component({
  selector: 'tg-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {
  public baseLinks: NavigationItem[] = [];
  public items: NavigationItem[] = [];
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
    for (const item in navigationSidebar) {
      if (navigationSidebar.hasOwnProperty(item)) {
        this.items.push(navigationSidebar[item]);
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
