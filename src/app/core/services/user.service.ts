import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { map, shareReplay, share, publishReplay, refCount } from 'rxjs/operators';
import { Character } from '../models/character.model';

const CACHE_SIZE = 1;



@Injectable()

export class UserService extends ApiService {

  private characters$: Observable<any>;
  private profile$: Observable<any>;

  getProfile(): any {
    if (!this.profile$) {
      this.profile$ = this.requestProfile()
        .pipe(
          shareReplay(CACHE_SIZE),
        );
    }
    return this.profile$;
  }

  public requestProfile(): Observable<any> {
    const obs$ = this.get('/profile/me')
      .pipe(
        map((response: ApiResponse) => {
          const data = response.data;
          return data;
        })
      );


    return obs$;
  }

  public getCharacters(): Observable<any> {
    this.characters$ = this.get('/profile/characters')
      .pipe(
        map(({ data: { chars } }: ApiResponse) => {
          chars.map(c => {
            return new Character().deserialize(c);
          });
        })
      );
    return this.characters$
  }
}
