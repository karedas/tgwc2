import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/message'
import { socketEvent } from '../models/socketEvent.enum';
import { environment } from '../../environments/environment';


import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  private socket;
  constructor() {  }


  public initSocket(): void {
    this.socket = io(environment.socket.url, environment.socket.options);
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public send(message: Message): void {
    this.socket.emit('message', message);
  }

  // public onMessage(): Observable<Message> {
  //   return new Observable<Message>(observer => {
  //     this.socket.on('message', (data: Message) => observer.next(data));
  //   });
  // }

  public onEvent(event: socketEvent): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }

}
