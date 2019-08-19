import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AnonymousGuard implements CanActivate {

  constructor(private authService: AuthService, private cookieService: CookieService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {

    if (!this.cookieService.check('tgCookieLaw')) {
      this.router.navigate(['/']);
    }

    /* Check if user is or not logged .
    // If is logged-in, diable the auth/* route.  */
    if ( !this.authService.userIsLoggedIn()) {
      return true;
    }
    return false;
  }
}
