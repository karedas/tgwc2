import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, ConnectableObservable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { map, tap, shareReplay, share, publishReplay, refCount } from 'rxjs/operators';
import { Character } from '../models/character.model';

const CACHE_SIZE = 1;

@Injectable()

export class UserService extends ApiService {

  private characters$: Observable<Array<Character>>;
  private profile$: Observable<any>;

  get profile(): any {
    if (!this.profile$) {
      this.profile$ = this.requestProfile()
      .pipe(
        shareReplay(CACHE_SIZE),
        );
      }
      
    return this.profile$;
  }

  get characters(): any {
    if (!this.characters$) {
      this.characters$ = this.requestCharacters().pipe(
        shareReplay(CACHE_SIZE)
      );
    }

    return this.characters$;
  }

  public requestProfile(): Observable<any> {
    let obs$ = this.get('/profile/me')
      .pipe(
        map((response: ApiResponse) => {
          const data = response.data;
          return data;
        })
      );

      
    return obs$;
  }

  public requestCharacters(): Observable<any>{
    let obs$ = this.get('/profile/characters')
      .pipe(
        map(({ data: { chars } }: ApiResponse) => {
          return chars.map((c => {
            return new Character().deserialize(c);
          }))
        }),
      )
      
    return obs$;
  }
}
