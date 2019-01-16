import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { socketEvent } from '../models/socketEvent.enum';
import { DataParser } from './dataParser.service';
import { Store, select } from '@ngrx/store';
import { LoginService } from '../main/authentication/services/login.service';
import { HistoryService } from './history.service';
import { State } from '../store';



@Injectable({
  providedIn: 'root'
})

export class GameService {
  private netData: string;
  newsNeeded: boolean = false;
  
  constructor(
    private loginService: LoginService,
    private socketService: SocketService,
    private dataParserService: DataParser,
    private store: Store<State>,
    private historyService: HistoryService
  ) { }

  startGame() {
    
    this.socketService.listen(socketEvent.DATA).subscribe(data => {
      this.handleServerGameData(data);
    });
  }

  disconnectGame() {
    //this.historyPush('Fine');
  }

  handleServerGameData(data) {
    this.netData += data;
    const len = this.netData.length;
    if (this.netData.indexOf('&!!', len - 3) !== -1) {
      const data = this.netData.substr(0, len - 3);
      this.dataParserService.parse(data);
      this.netData = '';

    } else if (len > 2000000) {
      this.netData = '';
      this.loginService.logout();
    }
  }

  /**
   *
   * @param val command value
   * @param isStored true or false if u need to watch history length)
   */
  processCommands(val: string, isStored: boolean = true ) {

    const cmds = this.dataParserService.parseInput(val);

    if (cmds) {
      /* check if cmd will be pushed in the history array */
      if (isStored) {
        this.historyService.push(val);
      }
      for (let i = 0; i < cmds.length; i++) {
        this.sendToServer(cmds[i]);
      }
    }
  }

  sendToServer(cmd) {
    this.socketService.emit('data', cmd);
  }

  // historyUpKey() {}

  // historyDownKey() {}


}
