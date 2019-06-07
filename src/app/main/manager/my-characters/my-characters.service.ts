import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

export class MyCharactersService extends ApiService implements Resolve<any>{

  onCharactersListChanged: BehaviorSubject<any>;
  charactersList: any;

  resolve( route: ActivatedRouteSnapshot, status: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    
    this.onCharactersListChanged = new BehaviorSubject<any>([]);
    
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getMyCharacters()
      ]).then( () => {
          resolve();
        },
        reject
      )
    });
  }

  getMyCharacters(): Promise<any[]> {

    return new Promise((resolve, reject) => {
      this.get('/user/characters')
        .subscribe((chars: any) => {
          this.charactersList = chars;
          this.onCharactersListChanged.next(this.charactersList);
          resolve(this.charactersList);
        }, reject);
    });
  }
}
