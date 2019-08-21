import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role } from '../models/role';

@Injectable()
export class AuthService {

  isLoginSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isLoggedin: BehaviorSubject<boolean>;


  constructor(private jwtHelper: JwtHelperService) {
    this.isLoginSubject.next(this.userIsLoggedIn());
    this._isLoggedin = new BehaviorSubject<boolean>(false);
  }

  set currentUser(user: User) {}

  get currentUser(): User {
    if (!this.userIsLoggedIn()) {
      return null;
    }
    return new User().deserialize(JSON.parse(localStorage.getItem('user')));
  }

  public isAdmin() {
    return this.currentUser && this.hasPermission(Role.Administrator);
  }

  public userIsLoggedIn(): boolean {
    const isTokenExpired = this.jwtHelper.isTokenExpired();
    if(!isTokenExpired) {
      return true;
    }
    else {
      this.removeAuthData();
      return false;
    }
  }

  public hasPermission(permission: string) {
    if (!this.userIsLoggedIn()) {
      return false;
    }
    return this.currentUser.hasPermission(permission);
  }

  public isEnableTo(permission: string) {

    if (!this.userIsLoggedIn()) {
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

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public getTokenExpirationDate(token: string): Date {
    const decoded = this.jwtHelper.decodeToken(token);
    if (decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  public saveAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    // Update the Observers
    this.isLoginSubject.next(true);
  }

  public removeAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Update the Observers
    this.isLoginSubject.next(false);
  }
}
