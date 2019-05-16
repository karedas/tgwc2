import { Injectable } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { socketEvent } from 'src/app/models/socketEvent.enum';
import { BehaviorSubject, Observable } from 'rxjs';
import { RegistrationData } from '../models/creation_data.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class RegistrationService implements Resolve<any> {
  
  private _dataReg: RegistrationData = new RegistrationData();
  
  $dataRegSubject: BehaviorSubject<RegistrationData> = new BehaviorSubject<RegistrationData>(this._dataReg);
  isCreatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  responseMessage: string;

  constructor(private socketService: SocketService) {
    this.setHandleRegistrationData();
    this.socketService.emit('registration');
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<any> | Promise<any> | any
  {
    return  this.getParams().subscribe((v) => console.log(v));
  }

  setParams(val) {
    this._dataReg = Object.assign({}, this._dataReg, val);
    this.$dataRegSubject.next(this._dataReg);
  }

  getParams(): Observable<RegistrationData> {
    return this.$dataRegSubject.asObservable();
  }

  isCreated() {
    return this.isCreatedSubject.asObservable();
  }

  register(data?: RegistrationData) {
    this.setHandleRegistrationData();
    this.socketService.emit('newcregistrationhar');
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
            this.test();
            // this.performRegistration();
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

  test() {
    console.log('test');
    this.socketService.emit('data', 'requestinvite:lisandr84@provaprova.com');
  }

  onError(error) {
  }

  onCreated(data: any) {
    this.socketService.off(socketEvent.REGISTRATION);
    this.responseMessage = data;
    this.isCreatedSubject.next(true);
  }

  private performRegistration() {
    let creationString = "create:"
      + this._dataReg.name.toString() + ","
      + this._dataReg.password.toString() + ","
      + this._dataReg.email.toString() + ","
      + (this._dataReg.invitation ?  this._dataReg.invitation.toString() : '') + ","
      + this._dataReg.race_code.toString() + ","
      + this._dataReg.sex.toString() + ","
      + this._dataReg.culture.toString() + ","
      + this._dataReg.start.toString() + ","
      + this._dataReg.stats.strength.toString() + ","
      + this._dataReg.stats.constitution.toString() + ","
      + this._dataReg.stats.size.toString() + ","
      + this._dataReg.stats.dexterity.toString() + ","
      + this._dataReg.stats.speed.toString() + ","
      + this._dataReg.stats.empathy.toString() + ","
      + this._dataReg.stats.intelligence.toString() + ","
      + this._dataReg.stats.willpower.toString()
      + "\n";


    this.socketService.emit('data', creationString);
  }
}
