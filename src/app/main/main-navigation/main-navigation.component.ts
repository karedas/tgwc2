import { Component, Input, OnDestroy, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { LoginService } from '../authentication/services/login.service';
import { SidebarService } from '../manager/sidebar/sidebar.service';

@Component({
  selector: 'tg-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss']
})
export class MainNavigationComponent implements OnDestroy {

  @Input('active') active: string;

  public loggedIn = false;
  public dataUser: any;
  public hamburgerStatus = false;

  constructor(
    private authService: AuthService,
    private loginService: LoginService,
    private router: Router,
    private sidebarService: SidebarService
  ) {


    this.router.events.subscribe((event: Event) => {
      if(event instanceof NavigationEnd) {
        this.setLoggedinUser(this.authService.isLoggedIn);
      }
    });
  }

  private setLoggedinUser(status) {
    if (status) {
      this.loggedIn = true;
      this.dataUser = this.authService.currentUser;
    }
    else {
      this.loggedIn = false;
      this.dataUser = null;
    }
  }

  onHamburgerClick(event) { 
    this.sidebarService.toggle();
  }


  userOnLogout() {
    this.loginService.logout().subscribe(() => {
      this.router.navigate(['auth/login']);
    });
  }

  ngOnDestroy(): void {
  }
}
