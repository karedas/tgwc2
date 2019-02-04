import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { getInGameStatus } from 'src/app/store/selectors';
import { ClientState } from 'src/app/store/state/client.state';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/main/authentication/services/login.service';
import { takeUntil, skip } from 'rxjs/operators';
import { DisconnectAction } from 'src/app/store/actions/client.action';

import { DialogService } from 'src/app/main/common/dialog/dialog.service';
import { DialogConfiguration } from 'src/app/main/common/dialog/model/dialog.interface';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UsernameValidation, PasswordValidation } from 'src/app/main/common/validations';

@Component({
  selector: 'tg-login-smart',
  templateUrl: './login-smart.component.html',
  styleUrls: ['./login-smart.component.scss']
})
export class LoginSmartComponent implements OnInit, OnDestroy  {

  // private loginForm: FormGroup;

  inGameState$: Observable<boolean>;
  dialogID = 'loginwidget';

  private _unsubscribeAll: Subject<any>;


  showForm = false;

  constructor(
    // private form: FormBuilder,
    private store: Store<ClientState>,
    private loginService: LoginService,
    private router: Router,
    private dialogService: DialogService) {

    this.inGameState$ = this.store.pipe(select(getInGameStatus));
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    // this.loginForm = this.form.group({
    //   'username': ['', UsernameValidation],
    //   'password': ['', PasswordValidation]
    // });

    this.inGameState$.pipe(
      takeUntil(this._unsubscribeAll),
      skip(1)).subscribe (
        ingame => {
        if (ingame == false) { this.open(); }
      }
    );
  }

  private open () {

    setTimeout(() => {
      this.dialogService.open(this.dialogID, <DialogConfiguration>{
        blockScroll: true,
        modal: true
      });
    });

  }

  onReconnect() {
    this.loginService.reconnect();
    // TODO: Wait OK from Server
    this.dialogService.close(this.dialogID);
  }

  toggle(event?: Event) {

    if (event) {
      event.preventDefault();
    }

    this.showForm = !this.showForm;
  }

  navigateToHome() {
    this.store.dispatch(new DisconnectAction);
    this.router.navigate(['/login']);
  }


  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
