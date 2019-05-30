import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { map, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { User } from 'src/app/core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends ApiService {

  isLoginSubject$ = new BehaviorSubject<boolean>(this.hasToken());

  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject$.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  public login(data: { email: string, password: string }): Observable<boolean> {

    const url = '/auth/login';

    return this.post(url, data).pipe(
      map((apiResponse: ApiResponse) => {
        if (apiResponse.httpCode !== 200) {
          return false;
        }

        const responseData = apiResponse.data;

        this.isLoginSubject$.next(true);

        if (responseData && responseData.token) {
          const user = new User().deserialize(responseData.user);
          this.authService.saveAuthData(responseData.token, user);
          return true;
        }
        return false;
      })
    );
  }

  public logout(): Observable<boolean> {
    return this.post('/auth/logout', []).pipe(
      map((apiResponse: ApiResponse) => {
        if (apiResponse.httpCode !== 200) {
          return false;
        }
        this.isLoginSubject$.next(false);
        this.authService.removeAuthData();
        return true;
      })
    );
  }
  
}
