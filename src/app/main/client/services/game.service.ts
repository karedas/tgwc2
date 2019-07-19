import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { SocketService } from '../../../core/services/socket.service';
import { socketEvent } from '../../../core/models/socketEvent.enum';
import { DataParser } from './dataParser.service';
import { HistoryService } from './history.service';
import { Observable, BehaviorSubject, timer, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';

import { equip_positions_by_name, pos_to_order, font_size_options } from 'src/app/main/client/common/constants';
import { ConfigService } from '../../../services/config.service';
import { TGConfig } from '../client-config';
import { MatDialog } from '@angular/material/dialog';

@Injectable()

export class GameService {

  private render: Renderer2;
  private _tgConfig: TGConfig;

  private _commandsList$: BehaviorSubject<any>;
  private _showStatus: BehaviorSubject<(boolean)>;
  private _dataSubscription: Subscription;
  private _upSubscription: Subscription;
  private _outputAutoScroll: BehaviorSubject<boolean>;
  public serverStat: Observable<any>;

  public mouseIsOnMap = false;
  public showExtraByViewport: boolean = undefined;
  public client_update = {
    now: 0,
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
      needed: false,
    }
  };

  constructor(
    private socketService: SocketService,
    private dataParserService: DataParser,
    private historyService: HistoryService,
    private http: HttpClient,
    private _configService: ConfigService,
    public dialog: MatDialog,
    rendererFactory: RendererFactory2,
  ) {
    this.serverStat = new BehaviorSubject<any>(null);
    this._commandsList$ = new BehaviorSubject(null);
    this._showStatus = new BehaviorSubject(null);
    this._outputAutoScroll = new BehaviorSubject(false);

    this.render = rendererFactory.createRenderer(null, null);

    this.init();
  }


  init() {
    this._configService.config
      .subscribe((config: TGConfig) => {
        this.setZenMode(config.zen);
        this._tgConfig = config;
      });
  }

  get tgConfig(): TGConfig {
    return this._tgConfig;
  }

  start(initialData:any): void {
    // Perform Reset before start any Environments Stuff.
    this.dataParserService.parse(initialData, this._tgConfig.log);

    this.socketService.on(socketEvent.DATA, 
      (data: any) => {
        this.dataParserService.parse(data, this._tgConfig.log);
      })
      
    this._upSubscription = this.dataParserService.updateNeeded.subscribe(this.updatePanels.bind(this));

    // this.socketService.listen(socketEvent.DATA)
    //   .subscribe(data => {
    //     this.dataParserService.parse(data, this._tgConfig.log);
    //   });
      
    // this._upSubscription = this.dataParserService.updateNeeded

    //   .subscribe((up) => {
    //     this.updatePanels(up);
    //   });
  }

  disconnectGame() {
    this.sendToServer('fine');
  }

  reset() {
    this._dataSubscription.unsubscribe();
    this._upSubscription.unsubscribe();
    this.clearUpdate();
  }

  updatePanels(what: any) {
    const now = Date.now();

    if (what[0] > this.client_update.inventory.version) {
      this.client_update.inventory.needed = true;
    }
    if (what[1] > this.client_update.equipment.version) {
      this.client_update.equipment.needed = true;
    }
    if (what[2] > this.client_update.room.version) {
      this.client_update.room.needed = true;
    }

    if (now > this.client_update.now) {

    // Update Inventory Panel
      if (this.client_update.inventory.needed && this.dialog.getDialogById('charactersheet') && this.client_update.invOpen) {
        this.sendToServer('@inv');
        this.client_update.inventory.needed = false;
        this.client_update.now = now;
      }

    // Update Equipment panel
      if (this.client_update.equipment.needed && this.dialog.getDialogById('charactersheet') && this.client_update.equipOpen) {
        this.sendToServer('@equip');
        this.client_update.now = now;
      }

    // Update Extra Detail
      if (this.client_update.room.needed && this.extraIsVisible && !this.client_update.inContainer) {
        this.sendToServer('@agg');
        this.client_update.room.needed = false;
        this.client_update.now = now;
      }
    }
  }

  updateMrnContainer() {
      this.sendToServer(`@agg &${this.client_update.mrnContainer}`);
  }

  private clearUpdate() {
    this.client_update.inventory.version = -1;
    this.client_update.inventory.needed = false;
    this.client_update.equipment.version = -1;
    this.client_update.equipment.needed = false;
    this.client_update.room.version = -1;
    this.client_update.room.needed = false;
  }

  // private loadServerStat() {
  //   this.serverStat = timer(0, 25000).pipe(
  //     switchMap(() => this.http.get(environment.serverstatAddress))
  //   );
  // }

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

  /**
   * UI UTILITY
   */

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

  public getStatusInline(): Observable<any> {
    return this._showStatus.asObservable();
  }

  public setZenMode(status: boolean) {
    if (status) {
      this.render.addClass(document.body, 'zen');
    } else {
      this.render.removeClass(document.body, 'zen');
    }
  }

  /* Order person or equip list */
  public orderObjectsList(items: any): any {
    if (items && items.list) {
      items.list.sort((a: any, b: any) => {
        const eq_pos_a = Object.keys(a.eq) ? pos_to_order[a.eq[0]] : 0;
        const eq_pos_b = Object.keys(b.eq) ? pos_to_order[b.eq[0]] : 0;
        return <number>eq_pos_a - <number>eq_pos_b;
      });
      return items;
    }

    /* Order for personal Equipment  */
    if (items && typeof items.ver === 'number') {

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
  public setOutputSize(size?: number, oldSize?: number) {

    const prefix = 'size-';
    let new_class: string;
    let old_class: string;

    if (oldSize) {
      old_class = prefix + font_size_options[oldSize].class;
    }
    if (!size && this._tgConfig) {
      size = (this._tgConfig.fontSize + 1) % font_size_options.length;
      old_class = prefix + font_size_options[this._tgConfig.fontSize].class;
      new_class = prefix + font_size_options[size].class;
    } else {
      new_class = prefix + font_size_options[size].class;
    }

    if (old_class) {

      this.render.removeClass(document.body, old_class);
      this.render.addClass(document.body, new_class);
    }

    this._configService.setConfig({ fontSize: size });
  }


  get extraIsVisible(): boolean {
    if (this._tgConfig.output.extraArea.visible && this.showExtraByViewport) {
      return true;
    } else {
      return false;
    }
  }
}
