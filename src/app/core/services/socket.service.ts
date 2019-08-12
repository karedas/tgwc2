import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

import * as io from 'socket.io-client';
import { socketEvent } from 'src/app/core/models/socketEvent.enum';
import * as ClientActions from 'src/app/main/client/store/actions/client.action';
import { Store } from '@ngrx/store';
import { TGState } from 'src/app/main/client/store';

export class SocketService {

  private socket: io;
  connected = false;
  socket_error$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor( private store: Store<TGState>) {
    this.connect();
  }

  get isConnected(): boolean {
    return this.connected;
  }

  set isConnected(value: boolean) {
    this.connected = value;
  }


  /** PUBLIC METHODS  */

  public connect(): void {
    if (!this.socket) {

      this.socket = io(environment.socket.url, environment.socket.options);
      // Adding basic Socket listeners
      this.socket.on(socketEvent.CONNECT,  this.onConnect);
      this.socket.on(socketEvent.DISCONNECT, this.onDisconnect);
      this.socket.on(socketEvent.CONNECTERROR, this.onError);
      this.socket.on(socketEvent.RECONNECT, this.onReconnect );
    } else if ( this.socket.disconnected ) {
      this.socket.connect();
    }
  }

  public disconnect(): void {
    this.store.dispatch(ClientActions.disconnectAction());
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

  private onError(err) {
    this.connected = false;
    this.socket_error$.next(true);
    this.socket.connect();
  }

  private onReconnect() {
  }

  private onDisconnect() {
    this.connected = false;
    this.connect();
  }
}
