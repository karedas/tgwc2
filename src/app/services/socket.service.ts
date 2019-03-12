import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { socketEvent } from '../models/socketEvent.enum';
import { environment } from '../../environments/environment';

import { Store } from '@ngrx/store';
import { State } from '../store';

import * as io from 'socket.io-client';
import { DisconnectAction } from '../store/actions/client.action';

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  private socket: io;

  // socketStatus: BehaviorSubject<any> = new BehaviorSubject('');
  connected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  socket_error$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  constructor(
    private store: Store<State>,
    ) {
    this.connect();
  }

  get isConnected () {
    return this.connected$.asObservable();
  }

  public connect(): void {
    if(!this.socket) {
      this.socket = io(environment.socket.url, environment.socket.options);
      this.startSocketEvent();
    }
  }

  private startSocketEvent() {
    /* Connected */
    this.socket.on(socketEvent.CONNECT, () => {
      this.connected$.next(true)
      this.socket_error$.next(false);
    });

    /* Disconnected */
    this.socket.on(socketEvent.DISCONNECT, () => {
      this.disconnect();
    });

    /* Error */
    this.socket.on(socketEvent.ERROR, (err: any) => {
      this.connected$.next(false);
      this.socket_error$.next(true);
      this.socket.connect();
    });

    /* Reconnection */
    this.socket.on(socketEvent.RECONNECT, () => { });
  }

  public disconnect(): void {
    this.store.dispatch(new DisconnectAction());
    this.connected$.next(false);
    if(!this.socket.isConnected) {
      this.socket.connect();
    }
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
    if (this.socket) {
      this.socket.off(event);
    }
  }
}
