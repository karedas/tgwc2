import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { navigationSidebar, ManagerNavigation } from './sidebar';
import { User } from 'src/app/core/models/user.model';



@Component({
  selector: 'tg-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {
  
  selectedItem = 0;
  // isAdmin: boolean = false;

  public links: ManagerNavigation[] = [];
  public currentUser: User;

  constructor(private authService: AuthService) { 
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
