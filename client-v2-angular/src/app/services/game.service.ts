import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SocketService } from './socket.service';
import { Event } from '../models/socketEvent.enum';


@Injectable({
  providedIn: 'root'
})

export class GameService {

  private subject = new Subject<any>();
  
  ioConnection: any;

  constructor(private socketService: SocketService) {
  }
  
  connectToServer() {
    /* Start the Socket Connection to the WebSocket Server */
    this.InitIOSocket();
  }

  private InitIOSocket(): void {
    // Initialize the IO Web Socket
    this.socketService.initSocket();

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('TG-LOG: Connessione al server avvenuta');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('TG-LOG: Disconnesso dal server');
      });

    this.socketService.onEvent(Event.ERROR)
      .subscribe(() => {
        console.log('TG-LOG: Errore di connessione al WebSocket');
      });

    this.socketService.onEvent(Event.RECONNECT)
      .subscribe(() => {
        console.log('TG-LOG: Tentativo di riconnessione al WebSocket');
      });

    // this.ioConnection = this.socketService.onMessage()
    //   .subscribe((message: Message) => {
    //     this.messages.push(message);
    //   });
  }
}
