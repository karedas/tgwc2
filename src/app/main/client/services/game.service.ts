import { HttpClient } from '@angular/common/http';
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { cloneDeep, isObject, some } from 'lodash';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { font_size_options, pos_to_order } from 'src/app/main/client/common/constants';
import { environment } from 'src/environments/environment';

import { socketEvent } from '../../../core/models/socketEvent.enum';
import { SocketService } from '../../../core/services/socket.service';
import { ConfigService } from '../../../services/config.service';
import { TGConfig } from '../client-config';
import { DataParser } from './dataParser.service';
import { HistoryService } from './history.service';

@Injectable()
export class GameService {
  private render: Renderer2;

  private _tgConfig: TGConfig;
  private _commandsList$: BehaviorSubject<any>;
  private _showStatus: BehaviorSubject<boolean>;
  private _upSubscription: Subscription;

  serverStat: Observable<any>;
  mouseIsOnMap = false;
  showExtraByViewport: boolean = undefined;
  isSmallDevice: boolean;
  client_update = {
    now: 0,
    mrnContainer: undefined,
    inContainer: false,
    invOpen: false,
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
    private _configService: ConfigService,
    private http: HttpClient,
    rendererFactory: RendererFactory2
  ) {
    this.serverStat = new BehaviorSubject<any>(null);
    this._commandsList$ = new BehaviorSubject(null);
    this._showStatus = new BehaviorSubject(null);
    this.render = rendererFactory.createRenderer(null, null);
    this.init();
  }

  get tgConfig(): TGConfig {
    return this._tgConfig;
  }

  get extraIsEnabled(): boolean {
    if (this._tgConfig.output.extraArea.visible && this.showExtraByViewport) {
      return true;
    } else {
      return false;
    }
  }

  private init() {
    this.loadServerStat();

    this._configService.config.subscribe((config: TGConfig) => {
      this.setZenMode(config.zen);
      this.setOutputSize(config.fontSize, true);
      this._tgConfig = config;
    });
  }

  private loadServerStat() {
    this.serverStat = timer(0, 25000).pipe(
      switchMap(() => this.http.get(environment.serverstatAddress))
    );
  }

  private updatePanels(what: any) {
    const now = Date.now();
    if (what[0] > this.client_update.inventory.version) {
      this.client_update.inventory.version = what[0];
      this.client_update.inventory.needed = true;
    }
    if (what[1] > this.client_update.equipment.version) {
      this.client_update.equipment.version = what[1];
      this.client_update.equipment.needed = true;
    }
    if (what[2] > this.client_update.room.version) {
      this.client_update.room.version = what[2];
      this.client_update.room.needed = true;
    }
    if (now > this.client_update.now) {
      // Update Inventory Panel
      this.upadteInventory(now);
      // Update Equipment panel
      this.upadteEquip(now);
      // Update Extra Detail
      this.updateInfo(now);
    }
  }

  private upadteInventory(now) {
    if (this.client_update.inventory.needed) {
      this.sendToServer('@inv');
      this.client_update.inventory.needed = false;
      this.client_update.now = now;
    }
  }

  private upadteEquip(now) {
    if (this.client_update.equipment.needed) {
      this.sendToServer('@equip');
      this.client_update.equipment.needed = false;
      this.client_update.now = now;
    }
  }

  private updateInfo(now) {
    // console.log(
    //   this.client_update.room.needed &&
    //   this.tgConfig.widgetRoom.visible &&
    //   !this.isSmallDevice &&
    //   !this.client_update.inContainer
    // );
    // console.log(
    //   this.client_update.room.needed ,
    //   this.tgConfig.widgetRoom.visible ,
    //   !this.isSmallDevice ,
    //   !this.client_update.inContainer
    // )
    if (
      this.client_update.room.needed &&
      this.tgConfig.widgetRoom.visible &&
      !this.isSmallDevice &&
      !this.client_update.inContainer
    ) {
      this.sendToServer('@agg');
      this.client_update.room.needed = false;
      this.client_update.now = now;
    }
  }

  private clearUpdate() {
    this.client_update.inventory.version = -1;
    this.client_update.inventory.needed = false;
    this.client_update.equipment.version = -1;
    this.client_update.equipment.needed = false;
    this.client_update.room.version = -1;
    this.client_update.room.needed = false;
  }

  /** PUBLIC  */

  public start(initialData: any): void {
    // Perform Reset before start any Environments Stuff.
    this.dataParserService.parse(initialData, this._tgConfig.log);
    this.socketService.on(socketEvent.DATA, (data: any) => {
      this.dataParserService.parse(data, this._tgConfig.log);
    });

    this._upSubscription = this.dataParserService
      .getUpdateNeeded()
      .subscribe((up) => this.updatePanels(up));
  }

  public resetUI() {
    this._upSubscription.unsubscribe();
    this.clearUpdate();
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

  /**  ---------------------------------------------------------------------------
     * UI Utility
      ---------------------------------------------------------------------------   */

  /* Commands List request */
  // TODO: needs Change for more performance and optimization
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

  /* Ordfer Objects Persons or Objects list */
  public orderObjectsList(items: any, type?: string): any {
    if (items) {
      const cont = cloneDeep(items);
      if (cont.list) {
        if (type === 'pers' || type === 'equip') {
          cont.list.sort((a, b) => {
            const eq_pos_a = Object.keys(a.eq) ? pos_to_order[a.eq[0]] : 0;
            const eq_pos_b = Object.keys(b.eq) ? pos_to_order[b.eq[0]] : 0;
            return (eq_pos_a as number) - (eq_pos_b as number);
          });

          return cont;
        }
      } else {
        const concatList = [];
        Object.keys(cont).forEach((poskey: any, idbx: any) => {
          const eqData = cont[poskey];
          if (some(eqData, isObject)) {
            eqData.sort((a, b) => {
              const eq_pos_a = Object.keys(a.eq) ? a.eq[1] : 0;
              const eq_pos_b = Object.keys(b.eq) ? b.eq[1] : 0;
              return (eq_pos_b as number) - (eq_pos_a as number);
            });

            concatList.push(eqData[0]);
            // add item in same equip position
            if (eqData[1]) {
              concatList.push(eqData[1]);
            }
          }
        });

        return concatList;
      }
    }

    return items;
  }

  /** Font Size Adjustement */
  public setOutputSize(size?: number, initSetup?: boolean) {
    const prefix = 'size-';
    let new_class: string;
    let old_class: string;
    // Initial Font-size set
    if (typeof size === 'number' && initSetup) {
      new_class = prefix + font_size_options[size].class;
      this.render.addClass(document.body, new_class);
      return;
    }
    // Rolling on Font-size
    if (typeof size !== 'number') {
      size = (this._tgConfig.fontSize + 1) % font_size_options.length;
    }
    old_class = prefix + font_size_options[this._tgConfig.fontSize].class;
    new_class = prefix + font_size_options[size].class;
    // Setting Class
    this.render.removeClass(document.body, old_class);
    this.render.addClass(document.body, new_class);
    // Saving fontsize in localstorage
    this._configService.setConfig({ fontSize: size });
  }

  // Send request to server by element click
  public interact(item: any, index: number = 0, mine?: boolean) {
    /* If is not a List */
    if (!item.sz) {
      if (item.cntnum && !mine) {
        this.processCommands(`guarda &${item.mrn[0]} &${item.cntnum}`, false);
      } else {
        this.processCommands(`guarda &${item.mrn[0]}`, false);
      }
    }

    /* Is a List */
    if (item.sz) {
      if (!item.cntnum && index >= 0) {
        this.processCommands(`guarda &${item.mrn[index]}`, false);
      } else if (item.cntnum && index >= 0) {
        this.processCommands(`guarda &${item.mrn[index]} &${item.cntnum}`, false);
      }
    }
  }
}
