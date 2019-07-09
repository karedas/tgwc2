import { Injectable } from '@angular/core';
import { SocketService, ISocketResponse } from '../../client/services/socket.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { socketEvent } from 'src/app/models/socketEvent.enum';


@Injectable()
export class VerifyCharacterService extends SocketService {

  verifySubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(undefined);
  
  private name: string;
  private pwd: string;



  public check(data: { characterName: string, characterPassword: string }): Observable<boolean> {
    this.name = data.characterName;
    this.pwd = data.characterPassword;

    // this.addListener(socketEvent.LOGIN,
    //   (data: any) => this.dispatchResponse(data));

    // Request a login call to the websocket
    // this.emit('loginrequest');

    // TEMP TEST
    this.verifySubject$.next(true)
    return this.verifySubject$.asObservable();
  }

  // private dispatchResponse(data) {

  //   let response: ISocketResponse;
  //   response = this.handleSocketData(data);
  //   console.log(response.event);
  //   switch (response.event) {

  //     case socketEvent.ENTERLOGIN:
  //       // this.tryLogin();
  //       break;

  //     case socketEvent.LOGINOK:
  //       // this.onLoginConfirmation();
  //       break;

  //     case socketEvent.ERROR:
  //       // On error
  //       console.log('whatefuck', response);
  //     //  this.onLoginRefuse();
  //       break;
  //   }
  // }

  // private tryLogin() {
  //   const credentials = `login:${this.name},${this.pwd}\n`;
  //   this.emit(socketEvent.DATA, credentials);
  // }

  // private onLoginConfirmation() {
  //   this.verifySubject$.next(true);
  // }

  // private onLoginRefuse() {
  //   this.verifySubject$.next(false);
  // }
}
