import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { loginError } from '../../authentication/services/login-errors';
import { SocketService, ISocketResponse } from 'src/app/core/services/socket.service';
import { GameService } from 'src/app/main/client/services/game.service';
import { socketEvent } from 'src/app/models/socketEvent.enum';
import { NGXLogger } from 'ngx-logger';

export const messages = {
  TRY_CONNECTION: 'Tentativo di connessione in corso...'
}



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
    private logger: NGXLogger
  ){}


  get isLoggedinValue(): boolean {
    return this.isLoggedInSubject.value;
  }

  get isLoggedIn(): Observable<any> {
    return this.isLoggedInSubject.asObservable();
  }

  set replayMessage(what: any) {
    if (loginError[what]) {
      this.loginErrorMessage$.next(loginError[what]);
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

  login(data: { name: string, secret: string }): Observable<boolean> {

    this.logger.log(`TGLOG: trying to login character "${name}"... `);

    // this.socketService.addListener(socketEvent.LOGIN, 
    //   (serverData: any) => {
    //     this.replayMessage =  messages.TRY_CONNECTION;
    //     const response: ISocketResponse = this.socketService.handleSocketData(serverData)
    //     switch(response.event) {
      
    //       case socketEvent.ENTERLOGIN:
    //         this.onEnterLogin();
    //         break;
            
    //         case socketEvent.LOGINOK:
    //         this.onLoginOk(response.data);
    //         break;
    //     }

    //   });
    this.socketService.addListener(socketEvent.LOGIN, this.socketService.handleSocketData);
    this.socketService.emit(socketEvent.LOGINREQUEST);
    
    return this.isLoggedIn;

  }

  // private dispatchResponse(res) {

  //   let response: ISocketResponse = this.socketService.handleSocketData(res)
    
  //   switch(response.event) {
      
  //     case socketEvent.ENTERLOGIN:
  //       this.onEnterLogin();
  //       break;
        
  //       case socketEvent.LOGINOK:
  //       this.onLoginOk(response.data);
  //       break;
  //   }
  // }

  logout() {
    this.isLoggedInSubject.next(false);
  }

  reconnect() {
    this.login({ name: this.name, secret: this.secret });
  }

  /** ---- Private Methods ---- */

  private resetHandler() {
    // this.socketService.off(socketEvent.LOGIN);
    // this.socketService.off(socketEvent.DATA);
    this.setHandleLoginData();
  }

  private setHandleLoginData() {
    // this.socketService.addListener(socketEvent.LOGIN,
      // (data: any) => this.handleLoginData(data));
  }

  private handleLoginData(data: any) {

    // if (data.indexOf('&!connmsg{') === 0) {
    //   const end = data.indexOf('}!');
    //   const rep = JSON.parse(data.slice(9, end + 1));

    //   if (rep.msg) {
    //     switch (rep.msg) {

    //       case socketEventName.READY:
    //         this.socketService.oob();
    //         break;
    //       case socketEventName.ENTERLOGIN:
    //         this.onEnterLogin();
    //         break;
    //       case socketEventName.SHUTDOWN:
    //         this.onShutDown();
    //         this.onEnterLogin();
    //         break;
    //       case socketEventName.REBOOT:
    //         this.onReboot();
    //         this.onEnterLogin();
    //         break;
    //       case socketEventName.LOGINOK:
    //         this.onLoginOk(data.slice(end + 2));
    //         break;
    //       case socketEventName.SERVERDOWN:
    //         this.onServerDown();
    //         break;
    //       default:
    //         this.onError(rep.msg);
    //         break;
    //     }
    //   }
    // }
  }

  private onEnterLogin() {
    const credentials = `login:${this.name},${this.secret}\n`;
    // this.socketService.emit(socketEvent.DATA, credentials);
  }

  private onLoginOk(data: any) {
    this.completeHandShake(data);
  }

  private completeHandShake(data: any) {
    // this.socketService.off(socketEvent.LOGIN);
    this.isLoggedInSubject.next(true);
    // this.game.startGame(data);
  }

  private onShutDown() {
    alert('Attenzione, il server è attualmente in manutenzione.');
  }

  private onReboot() {
    alert('Attenzione, il server sarà riavviato entro breve.');
  }

  private onServerDown() {
    alert('Attenzione, il server sarà spento entro breve per manutenzione.');
    this.replayMessage = 'serverdown';
  }

  private onError(err: any) {
    // this.socketService.off(socketEvent.LOGIN);
    this.replayMessage = err;
  }
}
