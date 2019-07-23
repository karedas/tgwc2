import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { User } from 'src/app/core/models/user.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends ApiService {

  public login(data: { username: string, password: string }): Observable<ApiResponse> {
    return this.post('/users/login', {user: data})
      .pipe( map(( apiResponse: ApiResponse ) => {
        if (!apiResponse.success) {
          return apiResponse;
        }
        const responseData = apiResponse.data;
        // this.isLoginSubject$.next(true);
        if (responseData && responseData.token) {
          const user = new User().deserialize(responseData.user);
          this.authService.saveAuthData(responseData.token, user);
        }
        return apiResponse;
      })
    );
  }

  public logout(): Observable<boolean> {
    return this.post('/users/logout', {id: this.authService.currentUser.id})
      .pipe(
        map((apiResponse: ApiResponse) => {
          if (!apiResponse.success) {
            return false;
          }
          this.authService.removeAuthData();
          return true;
        }),
      );
  }
}
