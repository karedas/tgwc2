import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { map, tap, catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { User } from 'src/app/core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends ApiService {

  // isLoginSubject$ = new BehaviorSubject<boolean>(this.hasToken());

  // private hasToken(): boolean {
  //   return !!localStorage.getItem('token');
  // }
  
  public login(data: { username: string, password: string }): Observable<ApiResponse> {

    const url = '/users/login';
    
    return this.post(url, {user: data})
      .pipe(
        map((apiResponse: ApiResponse) => {

          if (!apiResponse.success) {
            return apiResponse;
          }

          const responseData = apiResponse.data;
          // this.isLoginSubject$.next(true);
          if (responseData && responseData.token) {
            const user = new User().deserialize(responseData.user);
            this.authService.saveAuthData(responseData.token, user);
            return apiResponse;
          }

          return apiResponse;
        })
    );
  }

  public logout(): Observable<boolean> {

    const url = '/users/logout';

    return this.post(url, {id: this.authService.currentUser.id})
      .pipe(
        map((apiResponse: ApiResponse) => {

          if (!apiResponse.success) {
            return false;
          }
          // this.isLoginSubject$.next(false);
          this.authService.removeAuthData();
          return true;
        }),
    );
  }
}
