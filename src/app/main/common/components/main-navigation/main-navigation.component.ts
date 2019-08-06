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
import { User } from 'src/app/core/models/user.model';


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

  public userIsLoggedIn = false;
  public userIsInGame = false;
  
  public user: User;
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
          this.setMenuContext();
        }
      });

    this._unsubscribeAll = new Subject();
  }

  private getCharactersList(): Observable<Character> {
    return this.userService.getCharacters()
      .pipe(map((char: Character) => {
        return char.filter(c => c.status === 1);
      }));
  }

  private setMenuContext() {
    this.userIsLoggedIn = this.authService.userIsLoggedIn();

    // Global User Checking Online Status
    if (this.userIsLoggedIn) {
      this.user = this.authService.currentUser;
      this.charactersList = this.getCharactersList();
    } else {
      this.user = null;
      this.charactersList = null;
    }

    // set also if the user is loggedin with a character
    if (this.userIsInGame = this.loginClientService.isInGame) {
      this.makeGameMenu();
    }
  }

  // private isEnabled(value) {
  //   return value.status === 1;
  // }

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
