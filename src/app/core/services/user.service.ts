import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { map, share, publishReplay } from 'rxjs/operators';
import { Character } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})

export class UserService extends ApiService {

  characters$: any;

  public getProfile(): Observable<any> {
    return this.get('/profile/me')
      .pipe(
        map((response: ApiResponse) => {
        const data = response.data;
        return data;
      })
      );
  }

  public getCharacters(): Observable<any> {
    return this.get('/profile/characters')
      .pipe(
        share(),
        map(({ data: { chars } }: ApiResponse) => {
          return chars.map((c => {
            return new Character().deserialize(c); }))
        }),
      );
  }

}
