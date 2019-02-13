import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { ClientState } from 'src/app/store/state/client.state';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/main/authentication/services/login.service';
import { DisconnectAction } from 'src/app/store/actions/client.action';

import { DynamicDialogRef } from 'primeng/api';

@Component({
  selector: 'tg-login-smart',
  templateUrl: './login-smart.component.html',
  styleUrls: ['./login-smart.component.scss']
})
export class LoginSmartComponent implements OnInit, OnDestroy  {

  public readonly dialogID: string = 'loginwidget';
  public inGameState$: Observable<boolean>;
  private _unsubscribeAll: Subject<any>;
  public showForm = false;

  constructor(
    // private form: FormBuilder,
    private store: Store<ClientState>,
    private router: Router,
    private dialogRef: DynamicDialogRef,
    private loginService: LoginService) {

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

  }

  onReconnect() {
    this.loginService.reconnect();
    // TODO: Wait OK from Server
    this.dialogRef.close();
  }

  toggle(event?: Event) {

    if (event) {
      event.preventDefault();
    }

    this.showForm = !this.showForm;
  }

  navigateToHome() {
    this.dialogRef.close();
    this.router.navigate(['/login']).then(() => {
      this.store.dispatch(new DisconnectAction);
    });
  }


  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
