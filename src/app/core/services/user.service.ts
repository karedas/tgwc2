import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UserService extends ApiService {
  
  public getProfile(): Observable<any> {
    return this.get('/profile/me')
      .pipe(map((response: ApiResponse) => {
        const data = response.data;
        return data;
      })
    );
  }

  public getCharacters(): Observable<any> {
    return this.get('/profile/characters')
      .pipe(map((response: ApiResponse) => {
        const data = response.data;
        return data
      }));
  }

}
