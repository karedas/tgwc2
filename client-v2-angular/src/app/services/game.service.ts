import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { LoginService } from '../authentication/services/login.service';
import { socketEvent } from '../models/socketEvent.enum';
import { DataParser } from './dataParser.service';
import { Store } from '@ngrx/store';
import { ClientState } from 'src/app/store/state/client.state';
import { GameMode } from '../store/game.const';
import { NGXLogger } from 'ngx-logger';


@Injectable({
  providedIn: 'root'
})

export class GameService {
  netData: string;

  constructor(
    private loginService: LoginService,
    private socketService: SocketService,
    private dataParserService: DataParser,
    private store: Store<ClientState>,
    private logger: NGXLogger
  ) { }

  startGame() {
    this.socketService.listen(socketEvent.DATA).subscribe(data => {
      this.handleServerGameData(data);
    });
    this.socketService.emit('data', '');

    //dispatch data from socket and call actions
    this.dataParserService.parseUiObject$.subscribe(
      data => this.updateUi(data),
      err => {
        this.logger.error('Data Error from Socket', err);
      }
    )
  }

  handleServerGameData(data) {
    this.netData += data;
    let len = this.netData.length;

    if (this.netData.indexOf('&!!', len - 3) !== -1) {
      let data = this.netData.substr(0, len - 3);
      this.dataParserService.parse(data);
      this.netData = '';
    }

    else if (len > 2000000) {
      this.netData = '';
      this.loginService.logout();
    }
  }

  updateUi(pdata: any) {
    console.log(pdata);
    switch (pdata.type) {
      case GameMode.HIDEINPUTTEXT:
        // this.hideInputText();
      case GameMode.SHOWINPUTTEXT:
        // this.showInputText();
      case GameMode.SKYPICTURE:
        // this.updateSky(pdata[0]);
      case GameMode.DOORSINFO:
        // this.setDoors(pdata.data);
      case GameMode.AUDIO:
        // this.playAudio(pdata.data);
      default:
        return;
    }
  }

  updateSky(map) {
  }

  hideInputText() { }

  showInputText() { }

  setDoors(data) { }

  playAudio(data) { }

  gameState(mode) {
    // let hideText = () => {
    // }
  }

  /**
   * 
   * @param val command value
   * @param isStored true or false if u need to watch history length)
   */
  processCommands(val: string, isStored?: boolean ) {

    let cmds = this.dataParserService.parseInput(val); 
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