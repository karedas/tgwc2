import { Component, Input, OnDestroy, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { LoginService } from '../authentication/services/login.service';
import { SidenavService } from '../manager/services/sidenav.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'tg-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss']
})
export class MainNavigationComponent implements OnDestroy {

  @Input('active') active: string;

  public loggedIn = false;
  public currentUser: any;
  public hamburgerStatus = false;

  constructor(
    private authService: AuthService,
    private loginService: LoginService,
    private router: Router,
    private sidenavService: SidenavService
  ) {
    this.router.events.subscribe((event: Event) => {
      if(event instanceof NavigationEnd) {
        this.setLoggedinUser(this.authService.isLoggedIn());
      }
    });
  }

  private setLoggedinUser(status: boolean) {
    
    if (status) {
      this.loggedIn = true;
      this.currentUser = this.authService.currentUser;
    }
    
    else {
      this.loggedIn = false;
      this.currentUser = null;
    }
  }

  onHamburgerClick(event) { 
    this.sidenavService.toggle();
  }


  userOnLogout() {
    this.loginService.logout().subscribe(() => {
      this.router.navigate(['auth/login']);
    });
  }

  ngOnDestroy(): void {
  }
}
