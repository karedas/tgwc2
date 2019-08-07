import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, share, shareReplay, retry } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';
import { AppError } from 'src/app/shared/errors/app.error';
import { NotAuthorizeError } from 'src/app/shared/errors/not-authorize.error';

const CACHE_SIZE = 1;

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient,
    protected authService: AuthService,
  ) {
  }


  public post(url: string, postData: any): Observable<any> {

    const endpoint = this.buildUrl(url);
    const headers = this.buildHeader();

    return this.http.post(endpoint, JSON.stringify(postData), { headers })
      .pipe(
        retry(1),
        map(response => {
          return new ApiResponse(response);
        }),
        catchError(this.handleError)
      );
  }

  public get(url: string): Observable<any> {

    const endpoint = this.buildUrl(url);
    const headers = this.buildHeader();

    return this.http.get(endpoint, { headers })
      .pipe(
        retry(1),
        map(response => {
          return new ApiResponse(response);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  public put(url: string, postData: any): Observable<any> {
    const endpoint = this.buildUrl(url);
    const headers = this.buildHeader();
    return this.http.put(endpoint, JSON.stringify(postData), {headers})
    .pipe(
      map(response => {
        return new ApiResponse(response);
      }),
      catchError(this.handleError)
    );
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

    if (error.status === 401) {
      return throwError(new NotAuthorizeError(error));
    }

    return throwError(() => {

      if (error instanceof HttpErrorResponse) {
        return new HttpErrorResponse(error);
      } else {  return new AppError(error); }
    });
  }
}
