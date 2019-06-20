import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { Observable, throwError, of } from 'rxjs';
import { AuthService } from './auth.service';
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
    return false;

    // return this.authService.isLoggedIn().pipe(
    //   map( loggedIn => {
    //     if(loggedIn) {
    //       return true;
    //     }
    //       this.router.navigate(['auth/login']);
    //       return false;

    //   }),
    //   catchError( () => {
    //       this.router.navigate(['auth/login']);
    //       return of(false);
    //   })
    // )
  }
}
