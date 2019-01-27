import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { SocketStatusAction, LoginFailureAction, LoginSuccessAction } from 'src/app/store/actions/client.action';
import { loginError } from './login-errors';
import { SocketService } from 'src/app/services/socket.service';
import { ClientState } from 'src/app/store/state/client.state';
import { socketEvent } from 'src/app/models/socketEvent.enum';
import { GameService } from 'src/app/services/game.service';

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

  public isLoggedIn$: Observable<any>;
  public isLoggedInSubject: BehaviorSubject<boolean>;

  private loginErrorMessage$: BehaviorSubject<string>;
  private username: string;
  private password: string;
  public redirectUrl: string;

  constructor(

    private socketService: SocketService,
    private game: GameService,
    private store: Store<ClientState>) {

    this.isLoggedInSubject = new BehaviorSubject(false);
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();

    this.loginErrorMessage$ = new BehaviorSubject('');

  }

  public login(data: { username: string, password: string }): Observable<boolean> {


    this.username = data.username;
    this.password = data.password;

    this.resetHandler();
    this.socketService.connect();
    this.setHandleLoginData();
    this.socketService.emit('loginrequest');
    return this.isLoggedInSubject.asObservable();
  }

  public logout() {
    // this.isLoggedInSubject.next(false);
  }

  public reconnect() {
    this.login({username: this.username, password: this.password});
  }

  private resetHandler() {
    this.socketService.off(socketEvent.LOGIN);
    this.socketService.off(socketEvent.DATA);
  }

  public get IsLoggedInStatus(): boolean {
    return this.isLoggedInSubject.value;
  }

  setHandleLoginData() {
    this.socketService.off(socketEvent.LOGIN);
    this.socketService.addListener(socketEvent.LOGIN, (data) => this.handleLoginData(data));
  }

  handleLoginData(data: any) {

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
            this.onLoginOk(data.slice(end + 2));
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

  onLoginOk(data: any) {
    this.completeHandShake();
    this.game.startGame();
    this.game.handleServerGameData(data);
    this.store.dispatch(new LoginSuccessAction());
  }

  completeHandShake() {
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
