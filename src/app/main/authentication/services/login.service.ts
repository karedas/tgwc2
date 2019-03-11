import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { SocketStatusAction, LoginSuccessAction } from 'src/app/store/actions/client.action';
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


    this._init();
  }

  public login(data: { username: string, password: string }): Observable<boolean> {
    
    this.username = data.username;
    this.password = data.password;

    this.resetHandler();
    this.socketService.emit('loginrequest');

    return this.isLoggedInSubject;
  }

  public logout() {
    this.isLoggedInSubject.next(false);
  }

  public reconnect() {
    this.login({ username: this.username, password: this.password });
  }

  private resetHandler() {
    this.socketService.connect();
    this.socketService.off(socketEvent.LOGIN);
    this.socketService.off(socketEvent.DATA);
    this.setHandleLoginData();
  }

  public get isLoggedinStatusValue(): boolean {
    return this.isLoggedInSubject.value;
  }

  public get isLoggedIn(): Observable<any> {
    return this.isLoggedInSubject.asObservable();
  }

  setHandleLoginData() {
    this.socketService.off(socketEvent.LOGIN);
    this.socketService.addListener(socketEvent.LOGIN, (data) => this.handleLoginData(data));
  }

  handleLoginData(data: any) {

    this._loginReplayMessage = 'Tentativo di connessione in corso...';

    if (data.indexOf('&!connmsg{') === 0) {
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
            this._loginReplayMessage = rep.msg;
            this.onError(rep.msg);
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
    this.completeHandShake(data);
    this.store.dispatch(new LoginSuccessAction());
  }

  completeHandShake(data: any) {
    this.socketService.off(socketEvent.LOGIN);
    this.isLoggedInSubject.next(true);
    this.game.startGame(data);
  }

  onShutDown() {
    this.store.dispatch(new SocketStatusAction('shutdown'));
  }

  onReboot() {
    alert('Il gioco è in stato di reboot, riprova tra un po');
    this.store.dispatch(new SocketStatusAction('reboot'));
    console.log('TGLOG: Attenzione, Reboot del server in corso, impossibile effettuare attualmente l\'accesso');
  }

  onServerDown() {
    this.store.dispatch(new SocketStatusAction('serverdown'));
    this._loginReplayMessage = 'serverdown';
  }

  onError(err: any) {
    this.socketService.off(socketEvent.LOGIN);
    this._loginReplayMessage = err;
  }

  set _loginReplayMessage(what: any) {
    if (loginError[what]) {
      this.loginErrorMessage$.next(loginError[what]);
    } else if (what) {
      this.loginErrorMessage$.next(what);
    }
  }

  get _loginReplayMessage(): any {
    return this.loginErrorMessage$.asObservable();
  }

  private _init(): void {

    this.socketService.isConnected
      .subscribe((c) => {
        if (c === true) {
          this._loginReplayMessage = ' ';
        }
        else if (this.socketService.socketError) {
          this._loginReplayMessage = this.socketService.socketError.value;
        }
      });
  }
}
