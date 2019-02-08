import { Injectable } from '@angular/core';
import {
    CanActivateChild,
    CanLoad, CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot, Router, Route
}
    from '@angular/router';

import { LoginService } from './login.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private loginService: LoginService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url: string = state.url;
        return this.checkLogin(url);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {
        const url = `/${route.path}`;
        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        if (this.loginService.isLoggedinStatusValue) {
            return true;
        }

        // Store the attempted URL for redirecting
        this.loginService.redirectUrl = url;

        // Navigate to the login page with extras
        this.router.navigate(['/login']);
        return false;
    }
}
