import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  injector: any;

  constructor(
    private authService: AuthService,
    private router: Router) {
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (!token) {
      return next.handle(request);
    }

    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });

    return next.handle(request)
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            return next.handle(request);
          }
        }),
        catchError((err: HttpErrorResponse) => {

          let errorMessage = '';
          if (err instanceof ErrorEvent) {
            if (err.error instanceof ErrorEvent) {
              // client-side error
              errorMessage = `Error: ${err.error.message}`;
            }
          } else {
            // server-side error
            errorMessage = `Error Code: ${err.status}\nMessage: ${err.message}`;
          }

          if (err.status === 401) {
              this.router.navigate(['auth/login']);
          }

          return throwError(errorMessage);

        })
      );
  }
}
