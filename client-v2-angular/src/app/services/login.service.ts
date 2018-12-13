import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { socketEvent } from '../models/socketEvent.enum';
import { Observable, BehaviorSubject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { Store } from '@ngrx/store';
import { GameState } from '../store/state/game.state';
import { AuthenticationType, LoginAction, LoginSuccessAction } from '../store/actions/game.action';
import { Player } from '../models';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private username: string;
  private password: string;
  isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private socketService: SocketService,
    private logger: NGXLogger,
    private store: Store<GameState>) {
  }

  public login({ username, password }): Observable<boolean> {

    this.logger.info('LoginService:', 'Authentication Request');

    this.username = username;
    this.password = password;

    this.socketService.connect();
    this.setHandleLoginData();
    this.socketService.send('loginrequest');
    return this.isLoggedInSubject.asObservable();
  }


  public isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }


  public logout() {
  //   localStorage.removeItem('token');
  //   this.socketService.removeListener(socketEvent.LOGIN, this.handleLoginData);
  //   this.isLoggedInSubject.next(false);
  }

  get isConnected() {
    return this.isConnected;
  }

  setHandleLoginData() {
    this.socketService.removeListener(socketEvent.LOGIN);
    this.socketService.addListener(socketEvent.LOGIN, (data) => this.handleLoginData(data));
  }

  handleLoginData(data) {

    
    if (data.indexOf("&!connmsg{") == 0) {
      const end = data.indexOf('}!');
      const rep = JSON.parse(data.slice(9, end + 1));

      if (rep.msg) {
        switch (rep.msg) {

          case socketEvent.READY:
            this.onReady();
            break;

          case socketEvent.ENTERLOGIN:
            this.onEnterLogin();
            break;

          case socketEvent.SHUTDOWN:
            this.onShutDown();
            break;

          case socketEvent.REBOOT:
            this.onReboot();
            break;

          case socketEvent.LOGINOK:
          console.log('yo!!!!!!!!!!!!!!');
            this.onLoginOk(data.slice(end + 2));
            break;

          default:
            this.socketService.removeListener(socketEvent.LOGIN);
            // this.loginError();
            break;
        }
      }
    }
  }

  onReady() {
    let when = new Date().getTime();
    this.socketService.send('oob', { itime: when.toString(16) });
  }

  onEnterLogin() {
    const credentials = `login:${this.username},${this.password}\n`;
    this.socketService.send(socketEvent.DATA, credentials);
  }

  onLoginOk(msg) {
    this.store.dispatch({
      type: AuthenticationType.LOGIN_SUCCESS,
      payload: <GameState>{
        isAuthenticated: true,
        player: <Player>{
          name: this.username,
          password: this.password
        }
      }
    });

    this.socketService.removeListener(socketEvent.LOGIN);
    this.isLoggedInSubject.next(true);

  }

  onShutDown() { };

  onReboot() { };
}