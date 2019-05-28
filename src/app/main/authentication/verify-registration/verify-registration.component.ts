import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NotAuthorizeError } from 'src/app/shared/errors/not-authorize.error';
import { ApiResponse } from 'src/app/core/models/api-response.model';

@Component({
  selector: 'tg-verify-registration',
  templateUrl: './verify-registration.component.html',
  styleUrls: ['./verify-registration.component.scss']
})
export class VerifyRegistrationComponent implements OnInit, OnDestroy{

  public response: any;
  private sub: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const v_code = params['token'];
      this.verifyVCode(v_code);
    });

  }

  verifyVCode(code: string) {

    const url = environment.apiAddress + '/auth/verify/' + code;
    this.http.get(url)
    .subscribe((apiResponse: ApiResponse) => {
    
        this.response = apiResponse

    }, (error) => {
      if (error instanceof NotAuthorizeError) {
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
