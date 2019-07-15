import { Injectable } from '@angular/core';
// import { SocketService } from 'src/app/main/client/services/socket.service';
import { socketEvent } from 'src/app/core/models/socketEvent.enum';
import { BehaviorSubject, Observable } from 'rxjs';
import { RegistrationData } from '../models/creation_data.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SocketService } from 'src/app/core/services/socket.service';

@Injectable({
  providedIn: 'root'
})

export class RegistrationService implements Resolve<any> {

  private _dataReg: RegistrationData = new RegistrationData();
  private requestType: string;
  private emailInvitationCode: string;

  $dataRegSubject: BehaviorSubject<RegistrationData> = new BehaviorSubject<RegistrationData>(this._dataReg);
  isCreatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  responseMessage: string;


  constructor(
    // private socketService: SocketService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.getParams().subscribe((v) => console.log(v));
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

  requestNewInvitationCode(email: string) {
    this.requestType = 'invite';
    this.emailInvitationCode = email;
    this.setHandleRegistrationData();
    // this.socketService.emit('registration');
  }

  register(data?: RegistrationData) {
    this.requestType = 'newchar';
    this.setHandleRegistrationData();
    // this.socketService.emit('newcregistrationchar');
  }

  private setHandleRegistrationData(d?: string) {
    this.resetHandler();
    // this.socketService.on(socketEvent.REGISTRATION,
      // (d: any) => this.handleRegistrationData(d));
  }

  private resetHandler() {
    // this.socketService.off(socketEvent.NEWCHAR);
    // this.socketService.off(socketEvent.REGISTRATION);
  }

  private handleRegistrationData(data: any) {
    if (data.indexOf('&!connmsg{') === 0) {
      const end = data.indexOf('}!');
      const rep = JSON.parse(data.slice(9, end + 1));

      if (rep.msg) {
        switch (rep.msg) {
          case 'ready':
            // this.socketService.oob();
            break;
          case 'enterlogin':
            if (this.requestType === 'invite') {
              this.performRequestInvitationCode();
            } else if (this.requestType === 'newchar') {
              this.performRegistration();
            }
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

  private performRequestInvitationCode() {
    // this.socketService.emit('data', 'requestinvite:' + this.emailInvitationCode);
  }

  private onError(error) {
  }

  private onCreated(data: any) {
    // this.socketService.off(socketEvent.REGISTRATION);
    this.responseMessage = data;
    this.isCreatedSubject.next(true);
  }

  private performRegistration() {
    const creationString = 'create:'
      + this._dataReg.name.toString() + ','
      + this._dataReg.password.toString() + ','
      + this._dataReg.email.toString() + ','
      + (this._dataReg.invitation ? this._dataReg.invitation.toString() : '') + ','
      + this._dataReg.race_code.toString() + ','
      + this._dataReg.sex.toString() + ','
      + this._dataReg.culture.toString() + ','
      + this._dataReg.start.toString() + ','
      + this._dataReg.stats.strength.toString() + ','
      + this._dataReg.stats.constitution.toString() + ','
      + this._dataReg.stats.size.toString() + ','
      + this._dataReg.stats.dexterity.toString() + ','
      + this._dataReg.stats.speed.toString() + ','
      + this._dataReg.stats.empathy.toString() + ','
      + this._dataReg.stats.intelligence.toString() + ','
      + this._dataReg.stats.willpower.toString()
      + '\n';


    // this.socketService.emit('data', creationString);
  }
}
