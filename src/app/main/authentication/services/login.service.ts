import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { loginError } from './login-errors';
import { SocketService } from 'src/app/services/socket.service';
import { socketEvent } from 'src/app/models/socketEvent.enum';
import { GameService } from 'src/app/main/client/services/game.service';

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
  private loginErrorMessage$: BehaviorSubject<string>;

  private username: string;
  private password: string;
  public redirectUrl: string;


  get isLoggedinValue(): boolean {
    return this.isLoggedInSubject.value;
  }

  get isLoggedIn(): Observable<any> {
    return this.isLoggedInSubject.asObservable();
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

  constructor(
    private socketService: SocketService,
    private game: GameService
  ) {
    this.isLoggedInSubject = new BehaviorSubject(false);
    this.loginErrorMessage$ = new BehaviorSubject('');
  }

  /** ---- Public Methods ---- */

  login(data: { username: string, password: string }): Observable<boolean> {

    this.username = data.username;
    this.password = data.password;

    this.resetHandler();

    this.socketService.emit('loginrequest');
    this._loginReplayMessage = 'Tentativo di connessione in corso...';

    return this.isLoggedIn;
  }

  logout() {
    this.isLoggedInSubject.next(false);
  }

  reconnect() {
    this.login({ username: this.username, password: this.password });
  }

  /** ---- Private Methods ---- */

  private resetHandler() {
    this.socketService.off(socketEvent.LOGIN);
    this.socketService.off(socketEvent.DATA);
    this.setHandleLoginData();
  }

  private setHandleLoginData() {
    this.socketService.addListener(socketEvent.LOGIN, 
      (data: any) => this.handleLoginData(data));
  }

  private handleLoginData(data: any) {

    if (data.indexOf('&!connmsg{') === 0) {
      const end = data.indexOf('}!');
      const rep = JSON.parse(data.slice(9, end + 1));

      if (rep.msg) {
        switch (rep.msg) {

          case loginEventName.READY:
            this.socketService.oob();
            break;
          case loginEventName.ENTERLOGIN:
            this.onEnterLogin();
            break;
          case loginEventName.SHUTDOWN:
            this.onShutDown();
            this.onEnterLogin();
            break;
          case loginEventName.REBOOT:
            this.onReboot();
            this.onEnterLogin();
            break;
          case loginEventName.LOGINOK:
            this.onLoginOk(data.slice(end + 2));
            break;
          case loginEventName.SERVERDOWN:
            this.onServerDown();
            break;
          default:
            this.onError(rep.msg);
            break;
        }
      }
    }
  }

  private onEnterLogin() {
    const credentials = `login:${this.username},${this.password}\n`;
    this.socketService.emit(socketEvent.DATA, credentials);
  }

  private onLoginOk(data: any) {
    this.completeHandShake(data);
  }

  private completeHandShake(data: any) {
    this.socketService.off(socketEvent.LOGIN);
    this.isLoggedInSubject.next(true);
    this.game.startGame(data);
  }

  private onShutDown() {
    alert('Attenzione, il server è attualmente in manutenzione.');
  }

  private onReboot() {
    alert('Attenzione, il server sarà riavviato entro breve.');
  }

  private onServerDown() {
    alert('Attenzione, il server sarà spento entro breve per manutenzione.');
    this._loginReplayMessage = 'serverdown';
  }

  private onError(err: any) {
    this.socketService.off(socketEvent.LOGIN);
    this._loginReplayMessage = err;
  }
}
