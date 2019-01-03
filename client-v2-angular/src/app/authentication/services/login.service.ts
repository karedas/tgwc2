import { Injectable } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { socketEvent } from '../../models/socketEvent.enum';
import { Observable, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { ClientState } from '../../store/state/client.state';
import { User } from 'src/app/models/user/user.model';
import { SocketStatusAction, LoginFailureAction } from 'src/app/store/actions/client.action';
import { loginError } from './login-errors';

export const loginEventName = {
  READY: 'ready',
  SHUTDOWN: 'shutdown',
  SERVERDOWN: 'serverdown',
  REBOOT: 'reboot',
  ENTERLOGIN: 'enterlogin',
  LOGINOK: 'loginok',
};

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  public isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn$: Observable<any>;
  private loginErrorMessage$: BehaviorSubject<string>;
  private username: string;
  private password: string;
  public redirectUrl: string;

  constructor(

    private socketService: SocketService,
    private store: Store<ClientState>) {

    this.isLoggedInSubject = new BehaviorSubject(false);
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();

    this.loginErrorMessage$ = new BehaviorSubject('');
  }

  public login(data: { username: string, password: string }): Observable<boolean> {


    this.username = data.username;
    this.password = data.password;

    this.socketService.connect();
    this.setHandleLoginData();

    this.socketService.emit('loginrequest');
    return this.isLoggedInSubject.asObservable();
  }

  public logout() {
    this.isLoggedInSubject.next(false);
  }

  public get IsLoggedInStatus(): boolean {
    return this.isLoggedInSubject.value;
  }

  setHandleLoginData() {
    this.socketService.off(socketEvent.LOGIN);
    this.socketService.addListener(socketEvent.LOGIN, (data) => this.handleLoginData(data));
  }

  handleLoginData(data) {

    this.loginReplayMessage = 'Tentativo di connessione in corso...';

    if (data.indexOf('&!connmsg{') == 0) {
      const end = data.indexOf('}!');
      const rep = JSON.parse(data.slice(9, end + 1));


      if (rep.msg) {
        switch (rep.msg) {

          case loginEventName.READY:
            this.onReady();
            break;
          case loginEventName.ENTERLOGIN:
            this.onEnterLogin();
            break;
          case loginEventName.SHUTDOWN:
            this.onShutDown();
            break;
          case loginEventName.REBOOT:
            this.onReboot();
            break;
          case loginEventName.LOGINOK:
            this.onLoginOk(data);
            break;
          case loginEventName.SERVERDOWN:
            this.onServerDown();
            break;
          default:
            this.loginReplayMessage = rep.msg;
            if (!this.loginErrorMessage$) {
              this.loginReplayMessage = 'errorproto';
            }
            this.onError(this.loginErrorMessage$);
            break;
        }
      }
    }
  }

  onReady() {
    const when = new Date().getTime();
    this.socketService.emit(socketEvent.OOB, { itime: when.toString(16) });
  }

  onEnterLogin() {
    const credentials = `login:${this.username},${this.password}\n`;
    this.socketService.emit(socketEvent.DATA, credentials);
  }

  onLoginOk(data) {
    /** Show NEWS TODO */
    //const user = new User({ state: 'Active' });
    this.socketService.off(socketEvent.LOGIN);
    this.isLoggedInSubject.next(true);
  }

  onShutDown() {
    this.store.dispatch(new SocketStatusAction('shutdown'));
  }

  onReboot() {
    this.store.dispatch(new SocketStatusAction('reboot'));
  }

  onServerDown() {
    this.store.dispatch(new SocketStatusAction('serverdown'));
    this.loginReplayMessage = 'serverdown';
  }

  onError(err) {
    this.socketService.off(socketEvent.LOGIN);
    this.store.dispatch(new LoginFailureAction(this.loginReplayMessage));
    this.loginReplayMessage = loginError[err];
  }

  set loginReplayMessage(what: any) {
    this.loginErrorMessage$.next(loginError[what]);
  }

  get loginReplayMessage(): any {
    return this.loginErrorMessage$.asObservable();
  }

}
