import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

import * as io from 'socket.io-client';
import { DisconnectAction } from 'src/app/store/actions/client.action';
import { socketEvent } from 'src/app/models/socketEvent.enum';
import { NGXLogger } from 'ngx-logger';
// import { socketEventName } from '../../authentication/services/login-client.service';
// import { socketEventName } from '../../authentication/services/login-client.service';
// import { ClientState } from 'src/app/store/state/client.state';
// import { Store } from '@ngrx/store';
// import { Store } from '@ngrx/store';
// import { ClientState } from '../../../store/state/client.state';
// import { DisconnectAction } from '../../../store/actions/client.action';

// @Injectable({
//   providedIn: 'root'
// })

export interface ISocketResponse {
  event: string
  data?: any
}

export class SocketService {

  private socket: io;

  connected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  socket_error$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  socketResponse: ISocketResponse;

  constructor(
    // private store: Store<ClientState>
    private logger: NGXLogger
  ) {
    this.connect();
  }

  get isConnected() {
    return this.connected$.asObservable();
  }

  public connect(): void {

    console.log('connect socket');
    if (!this.socket) {
      this.socket = io(environment.socket.url, environment.socket.options);
      this.initSocketEvent();
    }

  }

  private initSocketEvent() {
    /* Connected */
    this.socket.on(socketEvent.CONNECT, () => {
      this.logger.info(`TGLOG: socket.io client connected to ${environment.socket.url} WS server`)
      this.connected$.next(true);
      this.socket_error$.next(false);
    });

    /* Disconnected */
    this.socket.on(socketEvent.DISCONNECT, () => {
      this.logger.info(`TGLOG: socket.io client Disconnected`)
      this.disconnect();
    });

    /* Error */
    this.socket.on(socketEvent.CONNECTERROR, (err: any) => {
      this.logger.error(`TGLOG: Socker.io Error!`, err)
      this.connected$.next(false);
      this.socket_error$.next(true);
      this.socket.connect();
    });

    /* Reconnection */
    this.socket.on(socketEvent.RECONNECT, () => { });
  }

  public removeListener(event) {
    this.socket.removeListener(event);
  }

  public disconnect(): void {

    // this.store.dispatch(new DisconnectAction());

    this.connected$.next(false);
    if (!this.socket.isConnected) {
      this.socket.connect();
    }
  }

  public oob() {
    const when = new Date().getTime();
    this.emit(socketEvent.OOB, { itime: when.toString(16) });
  }

  public emit(event: any, data?: any) {
    this.socket.emit(event, data);
  }

  public listen(event: socketEvent): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, data => {
        observer.next(data);
      });
    });
  }

  public addListener(eventName: string, handler: any): void {
    // Avoid duplicate removing previous one
    this.socket.removeListener(eventName);
    // Then add the new heandler
    this.socket.on(eventName, handler);
  }

  public off(event: socketEvent): void {
    if (this.socket) {
      this.socket.off(event);
    }
  }


  handleSocketData(data: any): any {

    if (data.indexOf('&!connmsg{') === 0) {
      const end = data.indexOf('}!');
      const rep = JSON.parse(data.slice(9, end + 1));
      
      if (rep.msg) {
        switch (rep.msg) {
          case socketEvent.READY:
            this.oob();
          case socketEvent.ENTERLOGIN:
            return this.socketResponse = {
              event: socketEvent.ENTERLOGIN
            }
          case socketEvent.SHUTDOWN:
            return this.socketResponse = {
              event: socketEvent.SHUTDOWN
            }
          // this.onShutDown();
          // this.onEnterLogin();
          case socketEvent.REBOOT:
            return this.socketResponse = {
              event: socketEvent.REBOOT
            }
          // this.onReboot();
          // this.onEnterLogin();
          case socketEvent.LOGINOK:
            return this.socketResponse = {
              event: socketEvent.LOGINOK,
              data: (data.slice(end + 2))
            }
          case socketEvent.SERVERDOWN:
            // this.onServerDown();
            return this.socketResponse = {
              event: socketEvent.SERVERDOWN,
            }
          default:
            // this.onError(rep.msg);
            return this.socketResponse = {
              event: 'error',
              data: rep.msg
            }
        }
      }
    }
  }
}
