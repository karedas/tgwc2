import { Component,  ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/mergeMap';

import { Subject } from 'rxjs';

@Component({
  selector: 'tg-welcome-registration',
  templateUrl: './welcome-registration.component.html',
  styleUrls: ['./welcome-registration.component.scss']
})
export class WelcomeRegistrationComponent implements OnDestroy {

  @ViewChild('formEmail', { static: true}) formEmail: NgForm;

  userEmail: string;
  emailProcessed = false;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private router: Router,
    ) {
      this._unsubscribeAll = new Subject<any>();
    }
  checkCodeActivation() {
    this.router.navigate(['/auth/registrazione/wizard']);
  }

  // Send Email request to Server and wait response
  requestCodeViaEmail() {
    this.emailProcessed = true;
    this.formEmail.resetForm();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
