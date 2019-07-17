import { Injectable } from '@angular/core';
import {
  CanActivateChild,
  CanLoad, CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot, Router, Route
} from '@angular/router';

import { LoginClientService } from '../../client/services/login-client.service';

@Injectable({
  providedIn: 'root',
})
export class LoginClientGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private loginClientService: LoginClientService,
    private router: Router
    ) {
     }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    const url = `/${route.path}`;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.loginClientService.isLoggedIn) {
      return true;
    }

    // Store the attempted URL for redirecting
    this.loginClientService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/auth/login']);
    return false;
  }
}
