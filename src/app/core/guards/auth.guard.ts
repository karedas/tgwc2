import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const currentUser = this.authService.currentUser;
    if (currentUser) {
      // Get roles difference
      const roles = route.data.roles.some( (r: any) => this.authService.currentUser.permissions.includes(r));

      if (route.data.roles && !roles) {
        this.router.navigate(['errors/error-403']);
        return false;
      }

      return true;

    }
    this.router.navigate(['auth/login']);
  }
}
