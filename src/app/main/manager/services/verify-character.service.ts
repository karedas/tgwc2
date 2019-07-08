import { Injectable } from '@angular/core';
import { SocketService, ISocketResponse } from '../../client/services/socket.service';
import { Observable } from 'rxjs';
import { socketEvent } from 'src/app/models/socketEvent.enum';


export class VerifyCharacterService extends SocketService {

  verifySubject$: Observable<boolean>;
  private name: string;
  private pwd: string;

  check (data: {characterName: string, characterPassword: string}): void{
    
    this.removeListener(socketEvent.LOGIN);

    this.addListener(socketEvent.LOGIN,
      (data: any) => this.dispatchResponse(data));

    this.name = data.characterName;
    this.pwd = data.characterPassword;

    // Starting request for Login
    this.emit('loginrequest');
  }

  private dispatchResponse(data) {

    let response: ISocketResponse;
    response = this.handleSocketData(data);

    if(response.event === 'enterlogin') {
      this.tryLogin();
    }
    else if(response.event === 'loginok') {
      this.onLoginConfirmation();
    }
    else {
      console.log(response);
    }
  }
  

  private tryLogin() {
      // this.emit(socketEvent.LOGIN, data);
      const credentials = `login:${this.name},${this.pwd}\n`;
      this.emit(socketEvent.DATA, credentials);
  }

  private onLoginConfirmation() {
    console.log('LOGINOK');
    
  }
}
