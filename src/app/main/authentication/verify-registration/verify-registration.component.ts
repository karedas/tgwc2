import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NotAuthorizeError } from 'src/app/shared/errors/not-authorize.error';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { tgAnimations } from 'src/app/animations';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'tg-verify-registration',
  templateUrl: './verify-registration.component.html',
  styleUrls: ['./verify-registration.component.scss'],
  animations: [tgAnimations]

})
export class VerifyRegistrationComponent implements OnInit, OnDestroy {

  public response: Subject<any>;
  public username: string;
  private sub: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.response = new Subject<any>();
  }

  ngOnInit() {
    this.sub = this.route.params
      .pipe(
        switchMap(param => this.verifyVCode(param['token'])))
      .subscribe( (val) => {console.log(val)});

  }

  verifyVCode(code: string) {
    const url = environment.apiAddress + '/auth/verify/' + code;
    return this.http.get(url).pipe(
      map((apiResponse: ApiResponse) => {
        this.username = apiResponse.data.username
        this.response.next(apiResponse);
      }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
