import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

export class DashboardService extends ApiService implements Resolve<any> {

  about: any = null;
  charactersList: any;
  aboutChanged: BehaviorSubject<any>;
  onCharactersListChanged: BehaviorSubject<any>;

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

    this.aboutChanged = new BehaviorSubject<any>({});
    this.onCharactersListChanged = new BehaviorSubject<any>([]);

    return new Promise((resolve, reject) => {
      Promise.all([
        this.getAbout(),
        this.getMyCharacters()
      ]).then(
        ([about, characters]) => {
            this.about = about;
            this.charactersList = characters;
            resolve();
        },
        reject
      )
    })
  }

  getAbout(): Promise<any[]> {

    return new Promise((resolve, reject) => {
      this.get('/profile/me')
        .subscribe((about: any) => {
          this.aboutChanged.next(about);
          resolve(about.data);
        }, reject);
    });

  }

  
  getMyCharacters(): Promise<any[]> {

    return new Promise((resolve, reject) => {
      this.get('/profile/characters')
        .subscribe((chars: any) => {
          this.onCharactersListChanged.next(chars);
          resolve(chars);
        }, reject);
    });

  }

}
