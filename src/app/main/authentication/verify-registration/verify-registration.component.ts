import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { tgAnimations } from 'src/app/animations';
import { Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'tg-verify-registration',
  templateUrl: './verify-registration.component.html',
  styleUrls: ['../auth.component.scss'],
  animations: [tgAnimations]

})
export class VerifyRegistrationComponent implements OnInit, OnDestroy {

  public username: string;
  public success: boolean = null;
  public loginFailedError: string;
  private sub: any;



  constructor(private route: ActivatedRoute, private http: HttpClient) {
  }

  ngOnInit() {
    this.sub = this.route.params
      .pipe(
        switchMap(param => this.verifyVCode(param['token']) )
      )
      .subscribe();

  }

  verifyVCode(code: string): Observable<any> {

    const url = environment.apiAddress + '/auth/verify/' + code;

    return this.http.get(url)
      .pipe(
        map((apiResponse: ApiResponse) => {
          this.username = apiResponse.data.username;
          this.success = apiResponse.success;
        }),
        catchError(err => {
          this.loginFailedError = err.error.status;
          this.success = false;
          return  throwError(err);
        })
      );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
