import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

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
    private authService: AuthService
  ) { }

  ngOnInit() {
    if ( this.authService.isLoggedIn () ) {
      this.loggedIn = true;
      //get data user
      this.dataUser = this.authService.currentUser;
      console.log(this.dataUser);
    }
  }

  onHamburgerClick() {
    this.hamburgerStatus = !this.hamburgerStatus;
  }
  

  userOnLogout() {
  }

}
