import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { 
    this.getGameTime();
  }


  getGameTime(): Observable<any> {
    return this.http.get('http://localhost:9595/api/v1/game/gametime')
  }
}
