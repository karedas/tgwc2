import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';

@Injectable()
export class DashboardService extends ApiService{

  about: any = null;
  charactersList: any;
  aboutChanged: BehaviorSubject<any>;
  onCharactersListChanged: BehaviorSubject<any>;

  // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

  //   this.aboutChanged = new BehaviorSubject<any>({});
  //   this.onCharactersListChanged = new BehaviorSubject<any>([]);

  //   return new Promise((resolve, reject) => {
  //     Promise.all([
  //       this.getAbout(),
  //       // this.getMyCharacters()
  //     ]).then(
  //       ([about, characters]) => {
  //           this.about = about;
  //           this.charactersList = characters;
  //           resolve();
  //       },
  //       reject
  //     )
  //   })
  // }

  public getProfile(): Observable<any> {
    return this.get('/profile/me')
      .pipe( map((response: ApiResponse) => {
        const data = response.data;
        return data;
        })
      );
  }

  
  public getMyCharacters(): Observable<any> {

    return this.get('/profile/characters')
      .pipe( map((response: ApiResponse) => {
        const data = response.data;
        return data
      }));
  }

}
