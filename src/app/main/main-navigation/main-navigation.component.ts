import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { LoginService } from '../authentication/services/login.service';
import { SidenavService } from '../manager/services/sidenav.service';
import { UserService } from 'src/app/core/services/user.service';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: 'tg-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss'],
  encapsulation: ViewEncapsulation.None
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

    this._unsubscribeAll = new Subject();
  }
  
  ngOnInit(): void {
    this.charactersList = this.userService.characters
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
