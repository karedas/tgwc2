import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/message'
import { socketEvent } from '../models/socketEvent.enum';
import { environment } from '../../environments/environment';

import * as io from 'socket.io-client';
import { Store } from '@ngrx/store';
import { GameState } from '../store/state/game.state'; 
import { 
  SocketConnectionType, 
  AuthenticationType 
} from '../store/actions/game.action';


@Injectable({
  providedIn: 'root'
})

export class SocketService {

  private socket;
  private netdata;

  constructor(private store: Store<GameState>) { }

  public connect(): void {
    if (this.socket) {
      this.socket.destroy();
      delete this.socket;
      this.socket = null;
    }

    this.socket = io(environment.socket.url, environment.socket.options);
    console.log(this.socket);

    /* Connected */
    this.socket.on(socketEvent.CONNECT, () => {
        this.store.dispatch({type: SocketConnectionType.CONNECT, payload: 'connect'});
    });

    /* Disconnected */
    this.socket.on(socketEvent.DISCONNECT, () => {
      this.disconnect();
      this.store.dispatch({type: SocketConnectionType.DISCONNECT});
    });
    
    /* Error */
    this.socket.on(socketEvent.ERROR, () => {
      this.store.dispatch({type: AuthenticationType.LOGIN_FAILURE});
    });
    
    /* Reconnection */
    this.socket.on(socketEvent.RECONNECT, () => {});
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public send(eventName:string, data?): void {
    this.socket.emit(eventName, data);
  }

  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('data', (data: Message) => observer.next(data));
    });
  }

  public onEvent(event: socketEvent): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }

  public addListener(eventName: string, handler: any): void {
    this.socket.on(eventName, handler);
  }

  public removeListener(event: socketEvent): void {
    console.log('removed?', event);
    this.socket.off(event);
  }
}
