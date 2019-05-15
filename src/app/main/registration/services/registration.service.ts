import { Injectable } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { socketEvent } from 'src/app/models/socketEvent.enum';
import { BehaviorSubject } from 'rxjs';
import { registratiionReplayMessage } from './registration-replay-msg.const';
import { RegistrationData } from '../models/creation_data.model';

@Injectable()

export class RegistrationService {

  datareg: RegistrationData;
  isCreatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  responseMessage: string;

  constructor(private socketService: SocketService) {
  }

  isCreated() {
    return this.isCreatedSubject.asObservable();
  }

  register(data: RegistrationData) {
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
    this.responseMessage = data;
    this.isCreatedSubject.next(true);
  }

  private performRegistration() {

    let creationString = "create:"
      + this.datareg.name.toString() + ","
      + this.datareg.password.toString() + ","
      + this.datareg.email.toString() + ","
      + (this.datareg.invitation ?  this.datareg.invitation.toString() : '') + ","
      + this.datareg.race_code.toString() + ","
      + this.datareg.sex.toString() + ","
      + this.datareg.culture.toString() + ","
      + this.datareg.start.toString() + ","
      + this.datareg.stats.strength.toString() + ","
      + this.datareg.stats.constitution.toString() + ","
      + this.datareg.stats.size.toString() + ","
      + this.datareg.stats.dexterity.toString() + ","
      + this.datareg.stats.speed.toString() + ","
      + this.datareg.stats.empathy.toString() + ","
      + this.datareg.stats.intelligence.toString() + ","
      + this.datareg.stats.willpower.toString()
      + "\n";

    console.log(creationString);

    this.socketService.emit('data', creationString);
  }
}
