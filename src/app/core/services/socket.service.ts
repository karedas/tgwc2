import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

import * as io from 'socket.io-client';
import { socketEvent } from 'src/app/core/models/socketEvent.enum';
// import { socketEventName } from '../../authentication/services/login-client.service';
// import { ClientState } from 'src/app/store/state/client.state';
// import { Store } from '@ngrx/store';
// import { Store } from '@ngrx/store';
// import { ClientState } from '../../../store/state/client.state';
// import { DisconnectAction } from '../../../store/actions/client.action';

// @Injectable({
//   providedIn: 'root'
// })

// export interface ISocketResponse {
//   event: string
//   data?: any
// }

export class SocketService {

  private socket: io;
  connected = false;
  socket_error$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(/* private store: Store<ClientState>*/) {
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

      this.socket.on(socketEvent.CONNECT, () => {
        this.onConnect();
      });

      this.socket.on(socketEvent.DISCONNECT, () => {
        this.onDisconnect();
      });

      this.socket.on(socketEvent.CONNECTERROR, (err: any) => {
        this.onError();

      });

      this.socket.on(socketEvent.RECONNECT, () => {
        this.onReconnect();
      });

    } else if ( this.socket.disconnected ) {
      this.socket.connect();
    }
  }

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
      this.socket.on(event, data => {
        observer.next(data);
      });
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

  private onReconnect() {
  }

  private onDisconnect() {
    this.connected = false;
    this.connect();
  }
}
