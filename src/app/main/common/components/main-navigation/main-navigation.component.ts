import { Component, Input, OnDestroy, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { LoginService } from '../../../authentication/services/login.service';
import { UserService } from 'src/app/core/services/user.service';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


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
  public currentUser: any;
  public charactersList: Observable<any>;
  public hamburgerStatus = false;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private authService: AuthService,
    private loginService: LoginService,
    private router: Router,
    private userService: UserService
  ) {
    
    this.router.events
      .subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
          this.setLoggedinUser();
        }
      });

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

      // if(this.charactersList && this.loggedIn) {

      // this.charactersList
      //   .pipe(
      //     map((chars: any) => {
      //       console.log(chars);
      //       return chars.filter(
      //         (char: Character) => {
      //           console.log(char);
      //           return char.status === 1 }
      //       )
      //     }))
      //   .subscribe(chl => this.charactersList = chl);
      // }
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

  private isEnabled(value) {
    return value.status === 1;
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
