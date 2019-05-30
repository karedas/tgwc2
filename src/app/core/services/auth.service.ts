import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {

  constructor(private jwtHelper: JwtHelperService) { }

  isLoggedIn(): boolean {
    const tokenLife = !this.jwtHelper.isTokenExpired();
    return tokenLife;
  }

  hasPermission(permission: string) {
    if (this.isLoggedIn()) {
      return false;
    }
    return this.currentUser.hasPermission(permission);
  }

  isEnableTo(permission: string) {

    if (this.isLoggedIn()) {
      return false;
    }

    let found = false;

    for (let i = 0; i < this.currentUser.permissions.length && !found; i++) {
      if (this.currentUser.permissions[i].indexOf(permission) > -1) {
        found = true;
      }
    }

    return found;

  }

  get currentUser() {
    if ( !this.isLoggedIn() ) {
      return null;
    }

    return new User().deserialize(JSON.parse(localStorage.getItem('user')));
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public saveAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  public removeAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
}
