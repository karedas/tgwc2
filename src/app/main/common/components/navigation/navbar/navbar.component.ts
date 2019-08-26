import { Component, Input, OnDestroy, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginClientService } from 'src/app/main/client/services/login-client.service';
import { map } from 'rxjs/operators';
import { Character } from 'src/app/core/models/character.model';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user.model';
import { gameNavigationSideBar } from '../navigation';
import { DispenserService } from 'src/app/main/client/services/dispenser.service';


@Component({
  selector: 'tg-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavBarComponent implements OnDestroy {

  @Output() toggleSidenav = new EventEmitter<void>();
  @Input('active') active: string;

  readonly env = environment;

  public userIsLoggedIn: boolean = false;
  public userIsInGame: boolean = false;
  public user: User;
  public charactersList: Observable<any>;
  public hamburgerStatus: boolean = false;
  
  private _unsubscribeAll: Subject<any>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loginClientService: LoginClientService,
    private dispenserService: DispenserService,
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
    this.userIsInGame = this.loginClientService.isInGame;
    if (this.userIsInGame) {
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

  disconnectCharacter() {
    this.dispenserService.do('disconnect');
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
