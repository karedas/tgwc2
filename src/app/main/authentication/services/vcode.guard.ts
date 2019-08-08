import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VcodeGuard implements CanActivate {
  constructor() {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const params = route.params['token'];
    if (params) {
      return true;
    }

    return false;
  }
}
