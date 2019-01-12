import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { socketEvent } from '../models/socketEvent.enum';
import { DataParser } from './dataParser.service';
import { Store } from '@ngrx/store';
import { LoginService } from '../main/authentication/services/login.service';
import { ClientState } from '../store/state/client.state';
import { WelcomeNewsAction } from '../store/actions/client.action';



@Injectable({
  providedIn: 'root'
})

export class GameService {
  private netData: string;

  constructor(
    private loginService: LoginService,
    private socketService: SocketService,
    private dataParserService: DataParser,
    private store: Store<ClientState>,
  ) { }

  startGame() {
    this.socketService.listen(socketEvent.DATA).subscribe(data => {
      this.handleServerGameData(data);
    });
    // this.store.dispatch(new WelcomeNewsAction());
    if(!localStorage.getItem('welcomenews')) {
      this.showWelcomeNews();
    }
    else {
      this.goInGame();
    }

  }

  goInGame():void {
    this.socketService.emit('data', '');
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

  showWelcomeNews() {
    this.store.dispatch(new WelcomeNewsAction(true));
  }
/*
  updateSky(map) {
  }
/*
  hideInputText() { }

  showInputText() { }

  setDoors(data) { }

  playAudio(data) { }*/
/*
  gameState(mode) {
    // let hideText = () => {
    // }
  }*/

  /**
   *
   * @param val command value
   * @param isStored true or false if u need to watch history length)
   */
  processCommands(val: string, isStored?: boolean ) {

    const cmds = this.dataParserService.parseInput(val);
    if (cmds) {
      /* check if cmd will be pushed in the history array */
      if (isStored) {
    //         //_.historyPush(text);
      }
      for (let i = 0; i < cmds.length; i++) {
        this.sendToServer(cmds[i]);
      }
    }
  }

  sendToServer(cmd) {
    this.socketService.emit('data', cmd);
  }
}
