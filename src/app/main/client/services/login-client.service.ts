import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { SocketService } from 'src/app/core/services/socket.service';
import { socketEvent } from 'src/app/core/models/socketEvent.enum';
import { loginClientErrors } from '../../authentication/services/login-client-errors';

@Injectable({
  providedIn: 'root'
})
export class LoginClientService {

  public redirectUrl: string;
  public isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(undefined);
  private loginErrorMessage$: BehaviorSubject<string> =  new BehaviorSubject<string>('');;
  
  private name: string;
  private secret: string;

  constructor(
    private socketService: SocketService,
  ){}


  get isLoggedinValue(): boolean {
    return this.isLoggedInSubject.value;
  }

  get isLoggedIn(): Observable<any> {
    return this.isLoggedInSubject.asObservable();
  }

  set replayMessage(what: any) {
    if (loginClientErrors[what]) {
      this.loginErrorMessage$.next(loginClientErrors[what]);
    } else if (what) {
      this.loginErrorMessage$.next(what);
    }
  }

  get replayMessage(): any {
    return this.loginErrorMessage$.asObservable();
  }

  // constructor(
  //   private socketService: SocketService,
  //   private game: GameService
  // ) {
  //   this.isLoggedInSubject = new BehaviorSubject(false);
  //   this.loginErrorMessage$ = new BehaviorSubject('');
  // }

  /** ---- Public Methods ---- */

  public login(data: { name: string, secret: string }): Observable<boolean> {

    this.name = data.name;
    this.secret = data.secret;

    this.replayMessage =  'Tentativo di connessione in corso...';
    this.setHandleLoginData();

    return this.isLoggedInSubject.asObservable();
  }

  logout() {
    this.isLoggedInSubject.next(false);
  }

  reconnect() {
    this.login({ name: this.name, secret: this.secret });
  }


  private setHandleLoginData() {

    this.resetHandler();
    this.socketService.on(socketEvent.LOGIN,
      (data: any) => this.handleLoginData(data));
    this.socketService.emit(socketEvent.LOGINREQUEST);
  }

  /** ---- Private Methods ---- */

  private oob() {
    const when = new Date().getTime();
    this.socketService.emit(socketEvent.OOB, { itime: when.toString(16) });
  }

  private resetHandler() {
    this.socketService.removeListener(socketEvent.LOGIN);
    this.socketService.removeListener(socketEvent.DATA);
  }

  private handleLoginData(data: any) {

    console.log(data);
    if (data.indexOf('&!connmsg{') === 0) {
      const end = data.indexOf('}!');
      const rep = JSON.parse(data.slice(9, end + 1));

      if (rep.msg) {
        switch (rep.msg) {

          case socketEvent.READY:
            this.oob();
            break;
          case socketEvent.ENTERLOGIN:
            this.onEnterLogin();
            break;
          case socketEvent.SHUTDOWN:
            this.onShutDown();
            this.onEnterLogin();
            break;
          case socketEvent.REBOOT:
            this.onReboot();
            this.onEnterLogin();
            break;
          case socketEvent.LOGINOK:
            this.onLoginOk(data.slice(end + 2));
            break;
          case socketEvent.SERVERDOWN:
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
    const credentials = `login:${this.name},${this.secret}\n`;
    this.socketService.emit(socketEvent.DATA, credentials);
  }

  private onLoginOk(data: any) {
    this.replayMessage = `Personaggio <b class="tg-yellow">${this.name}</b> trovato.`;
    this.completeHandShake(data);
  }

  private completeHandShake(data: any) {
    this.socketService.off(socketEvent.LOGIN);
    this.isLoggedInSubject.next(true);
  }

  private onShutDown() {
    this.replayMessage = loginClientErrors.servershutdown;
  }

  private onReboot() {
    this.replayMessage = loginClientErrors.serverreboot;
  }

  private onServerDown() {
    this.replayMessage = loginClientErrors.serverdown;
  }

  private onError(err: any) {
    this.replayMessage = err;
    this.socketService.connect();
  }
}
