import { Component, Input, OnDestroy, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { LoginService } from '../../../authentication/services/login.service';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginClientService } from 'src/app/main/client/services/login-client.service';
import { map } from 'rxjs/operators';
import { Character } from 'src/app/core/models/character.model';
import { UserService } from 'src/app/core/services/user.service';
import { gameNavigationSideBar, NavigationItem } from '../navigation';


@Component({
  selector: 'tg-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainNavigationComponent implements OnDestroy {

  @Output() toggleSidenav = new EventEmitter<void>();
  @Input('active') active: string;

  readonly env = environment;

  public loggedIn = null;
  public userInGame = null;
  public currentUser: any;
  public charactersList: Observable<any>;
  public hamburgerStatus = false;
  // public gameItemsMenu:  NavigationItem[];

  private _unsubscribeAll: Subject<any>;

  constructor(
    private authService: AuthService,
    private loginService: LoginService,
    private router: Router,
    private loginClientService: LoginClientService,
    private userService: UserService
  ) {
    this.router.events
      .subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
          this.setLoggedinUser();
        }
      });
      
    
    this.charactersList = this.userService.getCharacters()
      .pipe(map((char: Character) => {
        return char.filter(c => c.status === 1);
      }));

    this._unsubscribeAll = new Subject();
  }

  private setLoggedinUser() {

    // Global User Checking Online Status
    const userStatus = this.authService.isLoggedIn();

    if (userStatus) {
      this.loggedIn = true;
      this.currentUser = this.authService.currentUser;
    } else {
      this.loggedIn = false;
      this.currentUser = false;
    }

    // set also if the user is loggedin with a character
    if (this.userInGame = this.loginClientService.isLoggedIn) {
      this.makeGameMenu();
    }
  }

  private isEnabled(value) {
    return value.status === 1;
  }

  private makeGameMenu() {
    for (const item in gameNavigationSideBar) {
      if (gameNavigationSideBar.hasOwnProperty(item)) {
        // this.gameItemsMenu.push(gameNavigationSideBar[item]);
      }
    }
  }

  userOnLogout() {
    this.authService.removeAuthData();
    this.router.navigate(['auth/login']);
  }

  loginCharacter(name) {
    this.loginClientService.login(name);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
