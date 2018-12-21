import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { LoginService } from '../authentication/services/login.service';
import { socketEvent } from '../models/socketEvent.enum';
import { MessageService } from './message.service';
import { Store } from '@ngrx/store';
import { ClientState } from 'src/app/store/state/client.state';


@Injectable({
  providedIn: 'root'
})

export class GameService {
  netData: string;

  constructor(
    private loginService: LoginService,
    private socketService: SocketService,
    private messageService: MessageService,
    private store: Store<ClientState>
  ) { }

  startGame() {
    this.socketService.listen(socketEvent.DATA).subscribe(data => {
      this.handleServerGameData(data);
    });

    this.socketService.emit('data', '');
  }

  handleServerGameData(data) {
    this.netData += data;
    let len = this.netData.length;

    if (this.netData.indexOf('&!!', len - 3) !== -1) {
      let data = this.netData.substr(0, len - 3);
      this.messageService.parse(data);
      this.netData = '';
    }

    else if (len > 2000000) {
      this.netData = '';
      this.loginService.logout();
    }
  }

  showOutput() {

  }
}