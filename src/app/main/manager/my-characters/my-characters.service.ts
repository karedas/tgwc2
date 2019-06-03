import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export class MyCharactersService extends ApiService implements Resolve<any>{

  resolve( route: ActivatedRouteSnapshot, status: RouterStateSnapshot): Observable<any> | Promise<any> | any {
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
    return new Promise((resolve, reject) => {});
  }
}
