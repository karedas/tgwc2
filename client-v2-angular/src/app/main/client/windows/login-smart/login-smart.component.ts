import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { getInGameStatus } from 'src/app/store/selectors';
import { ClientState } from 'src/app/store/state/client.state';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/main/authentication/services/login.service';
import { takeUntil, skip } from 'rxjs/operators';
import { DisconnectAction } from 'src/app/store/actions/client.action';

import { GenericDialogService } from 'src/app/main/common/dialog/dialog.service';
import { DialogConfiguration } from 'src/app/main/common/dialog/model/dialog.interface';

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
    private loginService: LoginService,
    private router: Router,
    private genericDialogService: GenericDialogService) {

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
      this.genericDialogService.open(this.dialogID, <DialogConfiguration>{
        blockScroll: true,
        modal: true
      });
    });

  }

  onReconnect() {
    this.loginService.reconnect();
    // TODO: Wait OK from Server
    this.genericDialogService.close(this.dialogID);
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
