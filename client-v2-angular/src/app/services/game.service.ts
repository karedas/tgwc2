import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { socketEvent } from '../models/socketEvent.enum';
import { SocketService } from './socket.service';
import { NetworkStatusService } from './networkstatus.service';

import { NGXLogger } from 'ngx-logger';


@Injectable({
  providedIn: 'root'
})

export class GameService {

  isConnected: boolean;
  ioConnection: any;

  inGame: boolean; 

  private subject = new Subject<any>();
  constructor(
    private socketService: SocketService,
    private networkService: NetworkStatusService,
    private logger: NGXLogger
    ) { }
  
  run() {
    /* Start the Socket Connection to the WebSocket Server */
    this.InitIOSocket();
  }

  private InitIOSocket(): void {
       this.socketService.initSocket();

    this.socketService.onEvent(socketEvent.CONNECT)
      .subscribe(() => {
        this.networkService.changeStatus('Il server è online');
        this.logger.debug('Websocket: ' + socketEvent.CONNECT);
      });

    this.socketService.onEvent(socketEvent.DISCONNECT)
      .subscribe(() => {
        this.networkService.changeStatus('Il server è Offline');
        this.logger.debug('Websocket: '+ socketEvent.DISCONNECT);

      });

    this.socketService.onEvent(socketEvent.ERROR)
      .subscribe(() => {
        this.logger.warn('Websocket: '+ socketEvent.ERROR);
      });

    this.socketService.onEvent(socketEvent.RECONNECT)
      .subscribe(() => {
        this.logger.debug('Websocket: '+ socketEvent.RECONNECT);
      });

    // this.ioConnection = this.socketService.onMessage()
    //   .subscribe((message: Message) => {
    //     this.messages.push(message);
    //   });
  }

  private onConnect() {
    this.inGame = true;
  }
  private onDisconnect() {
    this.setDisconnect();
  }
  private onError() {}
  private onReconnect() {}

  setDisconnect(){
    this.inGame = false;
  }
}
