import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { socketEvent } from '../models/socketEvent.enum';
import { DataParser } from './dataParser.service';
import { HistoryService } from './history.service';
import { Observable, Subject, BehaviorSubject, interval, timer } from 'rxjs';
import { GenericDialogService } from '../main/common/dialog/dialog.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';
import { faCarrot } from '@fortawesome/free-solid-svg-icons';


@Injectable({
  providedIn: 'root'
})

export class GameService {

  
  private _commandsList$: BehaviorSubject<any>;
  private _showStatus: BehaviorSubject<(boolean)>;
  public serverStat: Observable<any>;
  public mouseIsOnMap: boolean= false;
  public extraIsOpen: boolean;
  //Client Data Needed Updates
  public client_update = {
    lastDataTime: 0,
    mrnContainer: undefined,
    inContainer: false,
    invOpen: false,
    equipOpen: false,
    inventory: {
      version: -1,
      needed: false
    },
    equipment: {
      version: -1,
      needed: false
    },
    room: {
      version: -1,
      needed: false
    }
  };



  constructor(
    private socketService: SocketService,
    private dataParserService: DataParser,
    private historyService: HistoryService,
    private genericDialogService: GenericDialogService,
    private http: HttpClient
  ) {

    this.serverStat = new BehaviorSubject<any>(null);
    this._commandsList$ = new BehaviorSubject(null);
    this._showStatus = new BehaviorSubject(null);

    this.init();
  }

  init() {
    this.loadServerStat();
  }

  loadServerStat() {
    this.serverStat = timer(0, 25000).pipe(
      switchMap(() => this.http.get(environment.serverstatAddress)),
    );
  }

  startGame(initialData) {
    this.clearUpdate();
    this.dataParserService.handlerGameData(initialData);

    this.socketService.listen(socketEvent.DATA).subscribe(data => {
      this.dataParserService.handlerGameData(data);
    });

    this.dataParserService.updateNeeded.subscribe((up) => {
      this.updateNeeded(up);
    });
  }


  disconnectGame() {
    this.sendToServer('fine');
  }

  updateNeeded(what: any) {
    const now = Date.now();

    if(what.inventory > this.client_update.inventory.version) {
      this.client_update.inventory.needed = true;
    }

    if(what.equipment > this.client_update.equipment.version) {
      this.client_update.equipment.needed = true;
    }

    if(what.room > this.client_update.room.version) {
      this.client_update.room.needed = true;
    }

    if (now > this.client_update.lastDataTime) {

      if (this.client_update.inventory.needed && !this.genericDialogService.isClosed('charactersheet') && this.client_update.invOpen) {
        this.sendToServer('@inv');
        this.client_update.inventory.needed = false;
        this.client_update.lastDataTime = now;
      }

      if (this.client_update.equipment.needed && !this.genericDialogService.isClosed('charactersheet') && this.client_update.equipOpen) {
        this.sendToServer('@equip');
        this.client_update.lastDataTime = now;
      }

      if (this.client_update.room.needed && this.extraIsOpen && !this.client_update.inContainer) {
        this.sendToServer('@agg');
        this.client_update.room.needed = false;
        this.client_update.lastDataTime = now;
      } else if (this.client_update.inContainer  && this.extraIsOpen) {

        this.sendToServer(`@aggiorna &${this.client_update.mrnContainer}`)
      } 
      
    }
  }

  clearUpdate() {
    this.client_update.inventory.version = -1;
    this.client_update.inventory.needed = false;
    this.client_update.equipment.version = -1;
    this.client_update.equipment.needed = false;
    this.client_update.room.version = -1;
    this.client_update.room.needed = false;
  }

  /**
   * @param val command value
   * @param isStored true or false if u need to watch history length)
   */

  public processCommands(val: string, isStored: boolean = true) {

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

  public sendToServer(cmd: string) {
    this.socketService.emit('data', cmd);
  }

  public setDisconnect() {
    this.socketService.disconnect();
  }

  /* Commands List request */
  public setCommands(cmds: any) {
    this._commandsList$.next(cmds);
  }

  public getCommands(): Observable<any> {
    return this._commandsList$.asObservable();
  }

  public setStatusInline(val: boolean) {
    this._showStatus.next(val);
    setTimeout(() => {
      this._showStatus.next(false);
    }, 5000);
  }


  getStatusInline(): Observable<any> {
    return this._showStatus.asObservable();
  }
}
