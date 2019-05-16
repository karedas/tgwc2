import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RegistrationService } from '../services/registration.service';
import { RegistrationData } from '../models/creation_data.model';

@Component({
  selector: 'tg-summary-registration',
  templateUrl: './summary-registration.component.html',
  styleUrls: ['./summary-registration.component.scss']
})
export class SummaryRegistrationComponent implements OnInit, OnDestroy{

  // data: RegistrationData;
  data: RegistrationData;
  
  private _unsubscribeAll: Subject<any>;
  
  constructor(private registrationService: RegistrationService) {
    this._unsubscribeAll = new Subject();
  }
  
  ngOnInit() {  
    
    this.registrationService.getParams()
      .subscribe(params => {console.log(params); this.data = params});
    // this.route.queryParams
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe(params => {
    //     this.name =  params.name;
    //     this.race = params.race;
    //     this.start = params.start;
    //     this.culture = params.culture;
    //     this.email = params.email;
    //   })
  }

  print(event) {
    event.preventDefault();
    window.print();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();

  }
}
