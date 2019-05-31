import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends ApiService implements Resolve<any> {

  aboutChanged: BehaviorSubject<any>;

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getAbout()
      ]).then(
        () => { 
          resolve();
        },
        reject
      )
    })
  }

  getAbout(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.get('/auth/user/about')
          .subscribe((about: any) => {
              // this.about = about;
              // this.aboutOnChanged.next(this.about);
              // resolve(this.about);
              resolve();
          }, reject);
  });
  }
}
