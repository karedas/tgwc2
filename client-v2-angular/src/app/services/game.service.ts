import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SocketService } from './socket.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Injectable({
  providedIn: 'root'
})

export class GameService {
  messages: Message;
  inGame: boolean; 
  private subject = new Subject<any>();
  constructor(
    private socketService: SocketService,
    // private networkService: NetworkStatusService,
    // private logger: NGXLogger,
    ) { }
  
  newGame() {
  }

}
