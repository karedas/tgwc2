import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';
import { AppError } from 'src/app/shared/errors/app.error';
import { NotAuthorizeError } from 'src/app/shared/errors/not-authorize.error';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    protected authService: AuthService,
  ) { }

  
  public post(url: string, postData: any): Observable<any> {

    const endpoint = this.buildUrl(url);
    const headers = this.buildHeader();
    
    return this.http.post(endpoint, JSON.stringify(postData), {headers}).pipe(
      map( response => {
        return new ApiResponse(response);
      }),
      catchError(this.handleError.bind(this))
    );
    
  }

  public get(url: string): Observable<any> {

    const endpoint = this.buildUrl(url);
    const headers = this.buildHeader();

    return this.http.get(endpoint, { headers }).pipe(
      map( response => {
        // this.showLoading(false);
        return new ApiResponse(response);
      }),
      catchError(this.handleError.bind(this))
    )
  }

  private buildUrl(url: string): string {
    return environment.apiAddress + url;
  }

  private buildHeader(additionalHeaders = []): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }

  private handleError(error: HttpErrorResponse): Observable<AppError> {
    if (error.status === 401 ) {
      return throwError(new NotAuthorizeError(error));
    }
    return throwError(new AppError(error));
  }
}
