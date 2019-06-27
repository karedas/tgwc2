import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { Observable, throwError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const currentUser = this.authService.currentUser;
    if(currentUser) {
      console.log(currentUser);
      // Get roles difference 
      const roles = route.data.roles.some( (r: any) => this.authService.currentUser.permissions.includes(r))

      if(route.data.roles && !roles) {
        console.log('no permitted', currentUser.permissions)
        this.router.navigate(['errors/error-403']);
        return false;
      }

      console.log('Is Permitted: ', currentUser.permissions);
      return true;

    }

    this.router.navigate(['auth/login'], {queryParams: { returnUrl: state.url }});
  }
}
