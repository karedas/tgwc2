import { Component, Input, OnDestroy, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DispenserService } from 'src/app/main/client/services/dispenser.service';
import { LoginClientService } from 'src/app/main/authentication/services/login-client.service';


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

  public userIsInGame: boolean = false;
  public hamburgerStatus: boolean = false;
  
  private _unsubscribeAll: Subject<any>;

  constructor(
    private router: Router,
    private loginClientService: LoginClientService,
    private dispenserService: DispenserService,
  ) {
    this.router.events
      .subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
          this.userIsInGame = this.loginClientService.isInGame;
        }
      });

    this._unsubscribeAll = new Subject();
  }

  userOnLogout() {
    this.router.navigate(['auth/login-character']);
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
