import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { socketEvent } from '../models/socketEvent.enum';
import { DataParser } from './dataParser.service';
import { Store } from '@ngrx/store';
import { HistoryService } from './history.service';
import { State } from '../store';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class GameService {

  private commandsList$: Subject<any> = new Subject();

  clientUpdateNeeded = {
    inventory: 0,
    equipment: 0,
    room: 0
  };

  private lastDataTime = 0;

  constructor(
    private socketService: SocketService,
    private dataParserService: DataParser,
    private store: Store<State>,
    private historyService: HistoryService,
  ) {}

  startGame(initialData) {
    this.dataParserService.handlerGameData(initialData);

    this.socketService.listen(socketEvent.DATA).subscribe(data => {
      this.dataParserService.handlerGameData(data);
    });
  }


  disconnectGame() {
    this.sendToServer('fine');
  }

  updateUIByData(what: any) {
    const now = Date.now();
    if (now > this.lastDataTime + 1000 ) {

      if (what.room && what.room  >  this.clientUpdateNeeded.room ) {
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

  public getHsStatBgPos(condprc: number): string {
    const pos = -13 * Math.floor(12 * (100 - condprc) / 100);
    const styleValue = `0 ${pos}px`;
    return styleValue;
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
