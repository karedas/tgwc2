import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { socketEvent } from '../models/socketEvent.enum';
import { SocketService } from './socket.service';
import { NetworkStatusService } from './networkstatus.service';

import { NGXLogger } from 'ngx-logger';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Injectable({
  providedIn: 'root'
})

export class GameService {

  isConnected: boolean;
  ioConnection: any;
  messages: Message;

  inGame: boolean; 
  private subject = new Subject<any>();
  constructor(
    private socketService: SocketService,
    // private networkService: NetworkStatusService,
    // private logger: NGXLogger,
    ) { }
  
  newGame() {
    this.setSocketHandler();
  }

  private setSocketHandler(): void {

    // this.socketService.onEvent(socketEvent.CONNECT)
    //   .subscribe(() => {
    //     console.log(socketEvent.CONNECT);
    //     // this.networkService.changeStatus(socketEvent.CONNECT);
    //     this.isConnected = true;
    //   });

    // this.socketService.onEvent(socketEvent.DISCONNECT)
    //   .subscribe(() => {
    //   });

    // this.socketService.onEvent(socketEvent.ERROR)
    //   .subscribe(() => {
    //     console.log(socketEvent.ERROR);
    //   });

    // this.socketService.onEvent(socketEvent.RECONNECT)
    //   .subscribe(() => {
    //     console.log(socketEvent.RECONNECT);
    //   });
 
    this.socketService.onMessage().subscribe( msg => {
    });
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
