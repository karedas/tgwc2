import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role } from '../models/role';

@Injectable()
export class AuthService {

  isLoginSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  private _isLoggedin: BehaviorSubject<boolean>;


  constructor(private jwtHelper: JwtHelperService) {
    this._isLoggedin = new BehaviorSubject<any>(false);
  }

  get currentUser() {
    if ( !this.isLoggedIn() ) {
      return null;
    }
    return new User().deserialize(JSON.parse(localStorage.getItem('user')));
  }

  get isAdmin() {
    return this.currentUser && this.hasPermission(Role.Administrator);
  }

  public setUserLoggedinStatus(val: boolean) {
    this._isLoggedin.next(val);
  }

  public getUserLoggedInStatus(): Observable<any> {
    return this._isLoggedin.asObservable();
  }

  public isLoggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired();
  }

  public hasPermission(permission: string) {
    if (!this.isLoggedIn()) {
      return false;
    }
    return this.currentUser.hasPermission(permission);
  }

  public isEnableTo(permission: string) {

    if (!this.isLoggedIn()) {
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

  public saveAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    // Update the Observers
    this.setUserLoggedinStatus(true);
    this.isLoginSubject.next(true);
  }

  public removeAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Update the Observers
    this.setUserLoggedinStatus(false);
    this.isLoginSubject.next(false);
  }
}
