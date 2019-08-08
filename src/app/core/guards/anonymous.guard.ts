import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnonymousGuard implements CanActivate {

  constructor(private authService: AuthService) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    /* Check if user is or not logged in. If is logged-in, diable the auth/* route.  */
    console.log('is anonymous:' , !this.authService.userIsLoggedIn());
    if ( !this.authService.userIsLoggedIn() ) {
      return true;
    }
    return false;

  }
}
