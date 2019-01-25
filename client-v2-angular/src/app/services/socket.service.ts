import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { socketEvent } from '../models/socketEvent.enum';
import { environment } from '../../environments/environment';

import { Store } from '@ngrx/store';
import { State } from '../store';

import * as io from 'socket.io-client';
import * as ClientActions from '../store/actions/client.action';

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  private socket: io;
  connected$ = new BehaviorSubject<boolean>(false);


  constructor(private store: Store<State>) {
  }

  public connect(): void {
    if (this.socket) {
      this.socket.destroy();
      delete this.socket;
      this.socket = null;
    }

    this.socket = io(environment.socket.url, environment.socket.options);
    this.startSocketEvent();
  }

  private startSocketEvent() {
    /* Connected */
    this.socket.on(socketEvent.CONNECT, () => {
      this.store.dispatch(new ClientActions.SocketStatusAction('connect'));
    });

    /* Disconnected */
    this.socket.on(socketEvent.DISCONNECT, () => {
      this.disconnect();
      this.store.dispatch(new ClientActions.DisconnectAction());
    });

    /* Error */
    this.socket.on(socketEvent.ERROR, (err) => {
      this.store.dispatch(new ClientActions.LoginFailureAction(err));
    });

    /* Reconnection */
    this.socket.on(socketEvent.RECONNECT, () => { });
  }

  public disconnect(): void {
    this.socket.disconnect();
    this.connected$.next(false);
  }

  public emit(event: any, data?: any) {
    this.socket.emit(event, data);
  }

  public listen(event: socketEvent): Observable<any> {
    return new Observable<Event>(observer =>  {
      this.socket.on(event, data => {
        observer.next(data);
      });
    });
  }

  public addListener(eventName: string, handler: any): void {
    this.socket.on(eventName, handler);
  }

  public off(event: socketEvent): void {
    if(this.socket) {
      this.socket.off(event);
    }
  }
}
