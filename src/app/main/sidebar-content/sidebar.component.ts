import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { navigationSidebar, ManagerNavigation } from './sidebar';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'tg-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {
  public links: ManagerNavigation[] = [];
  public selectedItem = 0
  public currentUser: User;

  constructor(
    private authService: AuthService
    ) {
    this.currentUser = this.authService.currentUser;
  }

  ngOnInit() {
    
    for (let item in navigationSidebar) {
      if(navigationSidebar.hasOwnProperty(item)) {
        this.links.push(navigationSidebar[item]);
      }
    }
  }

  selectItmeMenu(i) {
    this.selectedItem = i;
  }

  isEnableFor(level: string): boolean {

    // return this.authService.isEnableTo(level);
    return true;
  }

  

}
