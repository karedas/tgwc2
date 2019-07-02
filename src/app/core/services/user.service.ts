import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, ConnectableObservable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { map, share, publishReplay, publish, shareReplay } from 'rxjs/operators';
import { Character } from '../models/character.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable()

export class UserService extends ApiService {

  characters$: any;

  constructor(
    http: HttpClient,
    authService: AuthService
  ) {
    super(http, authService);
    console.log('yo 1');
  }

  public getProfile(): Observable<any> {
    return this.get('/profile/me')
      .pipe(
        map((response: ApiResponse) => {
          const data = response.data;
          return data;
        })
      );
  }

  public getCharacters(): Observable<any>{

    let obs$ = this.get('/profile/characters')
      .pipe(
        map(({ data: { chars } }: ApiResponse) => {
          return chars.map((c => {
            return new Character().deserialize(c);
          }))
        }),
        shareReplay(1)
      )
    return obs$;
  }
}
