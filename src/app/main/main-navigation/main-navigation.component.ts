import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { LoginService } from '../authentication/services/login.service';
import { SidenavService } from '../manager/services/sidenav.service';
import { UserService } from 'src/app/core/services/user.service';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { filter, map } from 'rxjs/operators';
import { Character } from 'src/app/core/models/character.model';


@Component({
  selector: 'tg-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainNavigationComponent implements OnDestroy {

  @Input('active') active: string;

  readonly env = environment;

  public loggedIn = null;
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
        if (event instanceof NavigationEnd) {
          this.setLoggedinUser();
          this.charactersList = this.userService.characters;
        }
      });

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

      if(this.charactersList && this.loggedIn) {

        this.charactersList
          .pipe(
            map((chars: any) => {
              return chars.filter((char: Character) => { return char.status === 1 })
            }))
          .subscribe(chl => this.charactersList = chl);
      }
  }

  private setLoggedinUser() {

    const status = this.authService.isLoggedIn();
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
