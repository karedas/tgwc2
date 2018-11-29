import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Message } from '../models/message';
import { Event } from '../models/socketEvent.enum';

import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  private socket;

  private url = 'http://51.38.185.84:3335';
  private options = {
    'reconnection': true,
    'autoConnect:': true,
    'forceNew': true,
    'resource': 'socket.io',
    'transports': ['websocket'],
    'reconnectionDelay': 1500,
    'reconnectionAttempts': 'Infinity'
}

  constructor() { }

  public initSocket(): void {
    this.socket = io(this.url, this.options);
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  // public send(message: Message): void {
  //   this.socket.emit('message', message);
  // }

  // public onMessage(): Observable<Message> {
  //   return new Observable<Message>(observer => {
  //     this.socket.on('message', (data: Message) => observer.next(data));
  //   });
  // }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }

}
