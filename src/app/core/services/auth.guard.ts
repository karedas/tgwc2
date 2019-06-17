import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { Observable, throwError, of } from 'rxjs';
import { AuthService } from './auth.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn().pipe(
      map( loggedIn => {
        console.log('is authorized:', loggedIn);
        if(loggedIn) {
          return true;
        }
          this.router.navigate(['auth/login']);
          return false;

      }),
      catchError( () => {
          this.router.navigate(['auth/login']);
          return of(false);
      })
    )
  }
}
