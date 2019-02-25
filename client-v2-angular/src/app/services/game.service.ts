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


@Injectable({
  providedIn: 'root'
})

export class GameService {

  _focusInput: Subject<any>;

  private commandsList$: BehaviorSubject<any>;
  public serverStat: Observable<any>;
  public clientUpdateNeeded = {
    inventory: 0,
    equipment: 0,
    room: 0
  };

  public extraIsOpen: boolean;

  private lastDataTime = 0;


  constructor(
    private socketService: SocketService,
    private dataParserService: DataParser,
    private historyService: HistoryService,
    private genericDialogService: GenericDialogService,
    private http: HttpClient
  ) {

    this.serverStat = new BehaviorSubject<any>(null);
    this.commandsList$ = new BehaviorSubject(null);
    this._focusInput = new Subject();

    this.init();
  }

  init(){
    this.loadServerStat();
  }

  loadServerStat() {
    this.serverStat = timer(0, 25000).pipe(
      switchMap(() =>  this.http.get(environment.serverstatAddress)),
    )
  }

  startGame(initialData) {
    this.dataParserService.handlerGameData(initialData);

    this.socketService.listen(socketEvent.DATA).subscribe(data => {
      this.dataParserService.handlerGameData(data);
    });

    this.dataParserService.updateNeeded.subscribe((up) => {
      this.updateUIByData(up);
    });
  }


  disconnectGame() {
    this.sendToServer('fine');
  }

  updateUIByData(what: any) {

    const now = Date.now();
    if (now > this.lastDataTime + 1000 ) {
      if (what.inventory > this.clientUpdateNeeded.inventory && !this.genericDialogService.isClosed('charactersheet')) {
        this.sendToServer('@inv');
        this.clientUpdateNeeded.inventory = what.inventory;
        this.lastDataTime = now;
      }

      if (what.equipment > this.clientUpdateNeeded.equipment && !this.genericDialogService.isClosed('charactersheet')) {
        this.sendToServer('@equip');
        this.clientUpdateNeeded.equipment = what.equipment;
        this.lastDataTime = now;
      }

      console.log(this.extraIsOpen);
      if (what.room > this.clientUpdateNeeded.room &&  this.extraIsOpen === true) {
        console.log('update room!');
        this.sendToServer('@agg');
        this.clientUpdateNeeded.room = what.room;
        this.lastDataTime = now;
      }
    }
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
    this.commandsList$.next(cmds);
  }

  public getCommands(): Observable<any> {
    return this.commandsList$.asObservable();
  }
}
