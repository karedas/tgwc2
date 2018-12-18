import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { socketEvent } from '../models/socketEvent.enum';
import { Observable, BehaviorSubject, of} from 'rxjs';
import { tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { Store } from '@ngrx/store';
import { GameState } from '../store/state/game.state';
import { AuthenticationType, LoginAction, LoginSuccessAction } from '../store/actions/game.action';
import { Player } from '../models';



export const loginEventName = {
  READY : 'ready',
  SHUTDOWN : 'shutdown',
  SERVERDOWN: 'serverdown',
  REBOOT : 'reboot',
  ENTERLOGIN : 'enterlogin',
  LOGINOK: 'loginok',
}

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  public isLoggedInSubject : BehaviorSubject<boolean>;
  public isLoggedIn$ : Observable<any>; 

  redirectUrl: string;

  private username: string;
  private password: string;
  

  constructor(
    private socketService: SocketService,
    private logger: NGXLogger,
    private store: Store<GameState>) {

      this.isLoggedInSubject = new BehaviorSubject(false);
      this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
  }

  public login({ username, password }): Observable<boolean> {

    this.logger.info('LoginService:', 'Authentication Request');

    this.username = username;
    this.password = password;

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

    
    if (data.indexOf("&!connmsg{") == 0) {
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
            this.socketService.off(socketEvent.LOGIN);
            // this.loginError();
            break;
        }
      }
    }
  }

  onReady() {
    let when = new Date().getTime();
    this.socketService.emit(socketEvent.OOB, { itime: when.toString(16) });
  }

  onEnterLogin() {
    const credentials = `login:${this.username},${this.password}\n`;
    this.socketService.emit(socketEvent.DATA, credentials);
  }

  onLoginOk(msg) {
    /** Show NEWS TODO */
    
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
    
    this.socketService.off(socketEvent.LOGIN);
    this.isLoggedInSubject.next(true);
  }

  onShutDown() { 
    alert('onshutdown');
  };

  onReboot() {
    alert('onReboot');
   };

  onServerDown() {
    alert('onServerDown');
  }
}