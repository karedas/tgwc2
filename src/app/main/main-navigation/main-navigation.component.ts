import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { LoginService } from '../authentication/services/login.service';
import { SidenavService } from '../manager/services/sidenav.service';
import { UserService } from 'src/app/core/services/user.service';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'tg-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss']
})
export class MainNavigationComponent implements OnDestroy {

  @Input('active') active: string;
  
  readonly env = environment;

  public loggedIn = false;
  public currentUser: any;
  public charactersList: Observable<any>;
  public hamburgerStatus = false;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private authService: AuthService,
    private loginService: LoginService,
    private router: Router,
    private sidenavService: SidenavService,
    private userService: UserService
  ) {
    this.router.events
      .subscribe((event: Event) => {
        if(event instanceof NavigationEnd) {
          this.setLoggedinUser(this.authService.isLoggedIn());
        }
    });

    this.charactersList = this.userService.getCharacters();
    this._unsubscribeAll = new Subject();
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
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
