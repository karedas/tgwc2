import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { LoginService } from '../authentication/services/login.service';
import { socketEvent } from '../models/socketEvent.enum';
import { DataParser } from './dataParser.service';
import { Store } from '@ngrx/store';
import { ClientState } from 'src/app/store/state/client.state';
import { GameMode } from '../store/game.const';
import { Observable, BehaviorSubject } from 'rxjs';

import * as fromSelectors from 'src/app/store/selectors';
import { DataState } from '../store/state/data.state';



@Injectable({
  providedIn: 'root'
})

export class GameService {
  netData: string;

  private _history: BehaviorSubject<DataState[]> = new BehaviorSubject([]);
  messages$: Observable<any> =  this._history.asObservable();



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
    this.socketService.emit('data', '');

    // dispatch data from socket and call actions
    /*
    this.dataParserService.parseUiObject$.subscribe(
      data => this.updateUi(data),
      err => {
        console.error('Data Error from Socket', err);
      }
    )*/

    this.messages$ = this.store.select(fromSelectors.getData);
    this.messages$.subscribe(data => {
      this._history.next(data);
    });

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
        // this.hideInputText();
      case GameMode.SHOWINPUTTEXT:
        // this.showInputText();
      case GameMode.SKYPICTURE:
        // this.updateSky(pdata[0]);
      case GameMode.DOORSINFO:
        // this.setDoors(pdata.data);
      case GameMode.AUDIO:
        // this.playAudio(pdata.data);
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

  getHistory(): Observable<any> {
    return this._history;
  }

  pushInHistory(data) {
    this._history.next(data);
  }


  getRoom(data) {
    const res = '';
    /*res += '<div class="detailblock">';

    /*    if (data.title) {
            res += '<div class="room"><div class="out-title"></div>' + this.capFirstLetter.transform(data.title) + '</div>';
        }
        res += _.renderDetailsInner(info, type, false);

        if (info.image) {
            _.showImage($('#image-cont'), info.image);
        }

        res += '</div>'*/

    // this.pushInHistory(data);
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
