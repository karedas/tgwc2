import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SocketService } from './socket.service';
import { LoginService } from './login.service';
import { socketEvent } from '../models/socketEvent.enum';
import { ParserService } from './parser.service';


@Injectable({
  providedIn: 'root'
})


export class GameService {
  history$ = [];
  netData: string;

  constructor(
    private loginService: LoginService,
    private socketService: SocketService,
    private parserService: ParserService
  ) {
  }

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
      let data = this.parserService.preParseText(this.netData.substr(0, len - 3));

      this.parserService.parse(data).subscribe(message => {
          this.history$.push(message);
      });

      this.netData = '';
    }

    else if (len > 2000000) {
      this.netData = '';
      this.loginService.logout();
    }
  }
}