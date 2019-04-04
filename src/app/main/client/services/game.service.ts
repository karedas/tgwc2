import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { SocketService } from '../../../services/socket.service';
import { socketEvent } from '../../../models/socketEvent.enum';
import { DataParser } from '../../../services/dataParser.service';
import { HistoryService } from './history.service';
import { Observable, BehaviorSubject, timer, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { switchMap, distinctUntilChanged } from 'rxjs/operators';

import { equip_positions_by_name, pos_to_order, font_size_options } from 'src/app/main/common/constants';
import { ConfigService } from '../../../services/config.service';
import { TGConfig } from '../client-config';

@Injectable({
  providedIn: 'root'
})

export class GameService {


  tgConfig: TGConfig;

  private _commandsList$: BehaviorSubject<any>;
  private _showStatus: BehaviorSubject<(boolean)>;

  public serverStat: Observable<any>;
  public mouseIsOnMap = false;

  // Client Data Needed Updates
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

  private render: Renderer2;

  private _dataSubscription: Subscription;
  private _updateNeededSubscription: Subscription;


  constructor(
    private socketService: SocketService,
    private dataParserService: DataParser,
    private historyService: HistoryService,
    private http: HttpClient,
    private _configService: ConfigService,
    rendererFactory: RendererFactory2,
  ) {
    this.serverStat = new BehaviorSubject<any>(null);
    this._commandsList$ = new BehaviorSubject(null);
    this._showStatus = new BehaviorSubject(null);

    this.render = rendererFactory.createRenderer(null, null);

    this._init();
  }


  get config(): TGConfig {
    return this.tgConfig;
  }

  _init() {

    this._configService.config
      .pipe(distinctUntilChanged())
      .subscribe((config: TGConfig) => {
          this.tgConfig = config;
          console.log('gameservice config subscribe:', config);
        }
      );

    this.loadServerStat();
  }

  loadServerStat() {
    this.serverStat = timer(0, 25000).pipe(
      switchMap(() => this.http.get(environment.serverstatAddress)),
    );
  }

  startGame(initialData) {
    // Perform Reset before start any Environments Stuff.
    this.dataParserService.handlerGameData(initialData);

    this._dataSubscription = this.socketService.listen(socketEvent.DATA).subscribe(data => {
      this.dataParserService.handlerGameData(data);
    });

    this._updateNeededSubscription = this.dataParserService.updateNeeded.subscribe((up) => {

      this.updateNeeded(up);
    });
  }

  disconnectGame() {
    this.sendToServer('fine');
  }

  reset() {
    this._dataSubscription.unsubscribe();
    this._updateNeededSubscription.unsubscribe();
    this.clearUpdate();
  }

  updateNeeded(what: any) {
    const now = Date.now();

    if (what.inventory > this.client_update.inventory.version) {
      this.client_update.inventory.needed = true;
    }

    if (what.equipment > this.client_update.equipment.version) {
      this.client_update.equipment.needed = true;
    }

    if (what.room > this.client_update.room.version) {
      this.client_update.room.needed = true;
    }

    if (now > this.client_update.lastDataTime) {

      // if (this.client_update.inventory.needed && !this.genericDialogService.isClosed('charactersheet') && this.client_update.invOpen) {
      //   this.sendToServer('@inv');
      //   this.client_update.inventory.needed = false;
      //   this.client_update.lastDataTime = now;
      // }

      // if (this.client_update.equipment.needed && !this.genericDialogService.isClosed('charactersheet') && this.client_update.equipOpen) {
      //   this.sendToServer('@equip');
      //   this.client_update.lastDataTime = now;
      // }

      // if (this.client_update.room.needed && this.tgConfig.layout.extraOutput && !this.client_update.inContainer) {
      //   this.sendToServer('@agg');
      //   this.client_update.room.needed = false;
      //   this.client_update.lastDataTime = now;
      // } else if (this.client_update.inContainer && this.config.layout.extraOutput) {
      //   this.sendToServer(`@aggiorna &${this.client_update.mrnContainer}`);
      // }
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

  /* Order person or equip list */
  orderObjectsList(items: any): any {
    if (items && items.list) {
      items.list.sort((a: any, b: any) => {
        const eq_pos_a = Object.keys(a.eq) ? pos_to_order[a.eq[0]] : 0;
        const eq_pos_b = Object.keys(b.eq) ? pos_to_order[b.eq[0]] : 0;
        return <number>eq_pos_a - <number>eq_pos_b;
      });
      return items;
    }

    /* Order for personal Equipment  */
    if (items &&  typeof items.ver === 'number') {

      const cont = {
        list: []
      };

      Object.keys(items).forEach((poskey: any, idbx: any) => {
        const where = equip_positions_by_name[poskey];
        if (where) {
          cont.list = cont.list.concat(items[poskey]);
        }
      });

      cont.list.sort((a, b) => {
        const eq_pos_a = Object.keys(a.eq) ? pos_to_order[a.eq[1]] : 0;
        const eq_pos_b = Object.keys(b.eq) ? pos_to_order[b.eq[1]] : 0;
        return <number>eq_pos_a - <number>eq_pos_b;
      });

      return cont.list;
    }
  }


  /** Font Size Adjustement */

  setOutputSize() {
    const newSize = (this.tgConfig.layout.fontSize + 1 ) % font_size_options.length;
    const old_class = font_size_options[this.tgConfig.layout.fontSize].class;
    const new_class = font_size_options[newSize].class;

    if (old_class) {
      this.render.removeClass(document.body, old_class);
      this.render.addClass(document.body, new_class);
    }

    // Save in Storage
    this._configService.config =  {
      layout: {
        fontSize: newSize
      }
    };
  }
}
