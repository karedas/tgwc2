import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'tg-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss']
})
export class MainNavigationComponent implements OnInit {

  @Input('active') active: string;

  public loggedIn: boolean = false;
  public hamburgerStatus: boolean = false;


  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    if( this.authService.isLoggedIn () ) {
      this.loggedIn = true;
    }
  }

  onHamburgerClick() {
    this.hamburgerStatus = !this.hamburgerStatus;
  }

}
