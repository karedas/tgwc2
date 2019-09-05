import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookielawGuard implements CanActivate, CanLoad {
  constructor(
    private cookieService: CookieService,
    private router: Router
  ) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log('canActivate');
      return this.checkCookieLawConsent();
    }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
      if(this.cookieService.check('tgCookieLaw')) {
        console.log('canload');
        return true;

      }
      return false;
  }

  checkCookieLawConsent(): boolean {
    if(this.cookieService.check('tgCookieLaw')) {
      return true;
    }
    return false;
  }
}
