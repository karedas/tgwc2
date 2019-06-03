import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { LoginService } from '../authentication/services/login.service';

@Component({
  selector: 'tg-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss']
})
export class MainNavigationComponent implements OnInit {

  @Input('active') active: string;

  public loggedIn = false;
  public dataUser: any;
  public hamburgerStatus = false;


  constructor(
    private authService: AuthService,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {

    this.router.events
      .subscribe(() => this.checkLoggedinUser());
  }

  checkLoggedinUser() {
    if ( this.authService.isLoggedIn () ) {
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

}
