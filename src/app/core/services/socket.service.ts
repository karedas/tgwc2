import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

import * as io from 'socket.io-client';
import { socketEvent } from 'src/app/core/models/socketEvent.enum';
import * as ClientActions from 'src/app/main/client/store/actions/client.action';
import { Store } from '@ngrx/store';
import { TGState } from 'src/app/main/client/store';
import { Injectable } from '@angular/core';

@Injectable()
export class SocketService {

  private socket: any;
  connected = false;
  connectedSubject: BehaviorSubject<boolean>;
  socket_error$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor( private store: Store<TGState>) {
    this.connectedSubject =  new BehaviorSubject(false);
    this.init();
  }

  get isConnected(): boolean {
    return this.connected;
  }

  set isConnected(value: boolean) {
    this.connected = value;
    this.connectedSubject.next(this.isConnected);
  }

  connection(): Observable<boolean> {
    return this.connectedSubject.asObservable();
  }

  /** PUBLIC METHODS  */

  public init(): void {

    if (!this.socket) {
      this.socket = io(environment.socket.url, environment.socket.options);
      // Adding basic Socket listeners
      this.socket.on(socketEvent.CONNECT,  this.onConnect.bind(this));
      this.socket.on(socketEvent.DISCONNECT, this.onDisconnect.bind(this));
      this.socket.on(socketEvent.CONNECTERROR, this.onError.bind(this));
      this.socket.on(socketEvent.RECONNECT, this.onReconnect.bind(this));
    } else if ( this.socket.disconnected ) {
      this.socket.connect();
    }
  }

  // public connection(): Observable<boolean> {}

  public disconnect(): void {
    this.socket.disconnect();
  }

  public removeListener(event) {
    this.socket.removeListener(event);
  }

  public emit(event: any, data?: any) {
    this.socket.emit(event, data);
  }

  public listen(event: socketEvent): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, (data: any) => observer.next(data));
    });
  }

  public on(eventName: string, handler: any): void {
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

  private onConnect() {
    this.connected = true;
    this.socket_error$.next(false);
  }

  private onError() {
    this.connected = false;
    this.socket_error$.next(true);
    this.socket.connect();
  }

  private onReconnect() {}

  private onDisconnect() {
    this.store.dispatch(ClientActions.disconnectAction());
    this.connected = false;
    this.init();
  }
}
