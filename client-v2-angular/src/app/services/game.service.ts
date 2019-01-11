import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { LoginService } from '../authentication/services/login.service';
import { socketEvent } from '../models/socketEvent.enum';
import { DataParser } from './dataParser.service';
import { Store } from '@ngrx/store';
import { GameMode } from '../store/game.const';
import { Observable, BehaviorSubject } from 'rxjs';
import { State } from '../store';
import { IHistory } from '../models/client/history.model';



@Injectable({
  providedIn: 'root'
})

export class GameService {
  private netData: string;

  constructor(
    private loginService: LoginService,
    private socketService: SocketService,
    private dataParserService: DataParser,
    private store: Store<State>,
  ) { }

  startGame() {
    this.socketService.listen(socketEvent.DATA).subscribe(data => {
      this.handleServerGameData(data);
    });
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

  updateUi(pdata: any) {
    switch (pdata.type) {
      case GameMode.HIDEINPUTTEXT:
      case GameMode.SHOWINPUTTEXT:
      case GameMode.SKYPICTURE:
      case GameMode.DOORSINFO:
      case GameMode.AUDIO:
      case GameMode.UPDATE:
      case GameMode.IMAGEWITHGAMMA:
      case GameMode.IMAGE:
      case GameMode.PLAYERISLOGGEDIN:
      case GameMode.CLOSETEXTEDITOR:
      case GameMode.MAP:
      case GameMode.RENDERGENERIC:
      case GameMode.RENDERTABLE:
      case GameMode.ROOMDETAILS:
      case GameMode.PERSONDETAILS:
      case GameMode.OBJECTDETAILS:
      case GameMode.EQUIP:
      case GameMode.WORKABLELIST:
      case GameMode.SKILLS:
      case GameMode.PLAYERINFO:
      case GameMode.PLAYERSTATUS:
      case GameMode.NEWIMAGEREQUEST:
      case GameMode.SELECTABLEGENERIC:
      case GameMode.REFRESH:
      case GameMode.PAUSESCROLL:

      default:
        return;
    }
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
