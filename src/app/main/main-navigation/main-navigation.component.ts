import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { LoginService } from '../authentication/services/login.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { filter } from 'minimatch';
import { Location } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'tg-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss']
})
export class MainNavigationComponent implements OnDestroy{

  @Input('active') active: string;

  public loggedIn = false;
  public dataUser: any;
  public hamburgerStatus = false;
  state$: Observable<object>;

  private mediaQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,
    private loginService: LoginService,
    private router: Router,
    media: MediaMatcher) {

    this.mediaQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mediaQuery.addListener(this._mobileQueryListener);
    this.router.events
      .subscribe(() => this.checkLoggedinUser());
  }

  checkLoggedinUser() {
    if (this.authService.isLoggedIn()) {
      this.loggedIn = true;
      this.dataUser = this.authService.currentUser;
    }
    else {
      this.loggedIn = false;
      this.dataUser = null;
    }
  }

  onHamburgerClick() {
    this.hamburgerStatus = !this.hamburgerStatus;
  }


  userOnLogout() {
    this.loginService.logout().subscribe(() => {
      this.router.navigate(['auth/login']);
    });
  }

  ngOnDestroy(): void {
    this.mediaQuery.removeListener(this._mobileQueryListener);
  }
}
