import { Injectable } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { socketEvent } from 'src/app/models/socketEvent.enum';
import { BehaviorSubject } from 'rxjs';
import { registratiionReplayMessage } from './registration-replay-msg.const';

@Injectable()

export class RegistrationService {

  datareg: string;
  isCreatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private socketService: SocketService) {
  }

  isCreated() {
    return this.isCreatedSubject.asObservable();
  }

  test (data) {
    this.datareg = data;
    this.setHandleRegistrationData();
    this.socketService.emit('newchar');
  }

  setHandleRegistrationData() {
    this.resetHandler();
    this.socketService.addListener(socketEvent.REGISTRATION, 
      (data: any) => this.handleRegistrationData(data));
  }

  private resetHandler() {
    this.socketService.off(socketEvent.NEWCHAR);
    this.socketService.off(socketEvent.REGISTRATION);
  }

  private handleRegistrationData(data: any) {
    if (data.indexOf('&!connmsg{') === 0) {
      const end = data.indexOf('}!');
      const rep = JSON.parse(data.slice(9, end + 1));

      if (rep.msg) {
        switch (rep.msg) {
          case 'ready':
            this.socketService.oob();
          break;
          case 'enterlogin':
            this.performRegistration();
          break;
          case 'created': 
            this.onCreated(data.slice(end + 2));
          break;
          default:
          this.onError(rep.msg);
            break;
        }
      }
    }
  }

  onError(error) {
    console.log(registratiionReplayMessage[error]);
  }

  onCreated(data: any) {
    this.socketService.off(socketEvent.REGISTRATION);
    //TODO
    this.isCreatedSubject.next(true);
  }

  private performRegistration() {
    this.socketService.emit('data', this.datareg);
  }
}
