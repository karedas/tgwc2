import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.authService.userIsLoggedIn()) {
      // Get roles difference
      const roles = route.data.roles
        .some( (r: any) => this.authService.currentUser.permissions.includes(r));

      if (route.data.roles && !roles) {
        this.router.navigate(['errors/error-403']);
        return false;
      }

      return true;

    }
    this.router.navigate(['auth/login']);
  }
}
