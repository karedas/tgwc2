import { Component, ViewChild, OnInit, OnDestroy, ElementRef, HostListener, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { NgScrollbar } from 'ngx-scrollbar';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { getDataBase, getRoomBase, getObjOrPerson, getGenericPage, getInGameStatus } from 'src/app/main/client/store/selectors';
import { GameService } from 'src/app/main/client/services/game.service';
import { Room } from 'src/app/main/client/models/data/room.model';
import { SplitComponent } from 'angular-split';
import { IGenericPage } from 'src/app/main/client/models/data/genericpage.model';
import { ConfigService } from 'src/app/services/config.service';
import { TGConfig } from '../../client-config';
import { OutputService } from './output.service';
import { TGState } from '../../store';
import { SmartEquipInventoryComponent } from './smart-equip-inventory/smart-equip-inventory.component';

@Component({
  selector: 'tg-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss'],
})

export class OutputComponent implements OnInit, OnDestroy {

  tgConfig: TGConfig;

  @ViewChild('scrollBar', { static: false }) scrollBar: NgScrollbar;
  @ViewChild('scrollerEnd', { static: false }) scrollerEnd: ElementRef;
  @ViewChild('mainOutputArea', { static: false }) mainOutputArea: ElementRef;
  @ViewChild('splitArea', { static: false }) splitArea: SplitComponent;

  // Smart Equip/Inv
  smartSizeArea: number | string;
  //----------------

  lastRoom$: Observable<any>;
  showExtraByViewport: boolean;
  pauseScroll = false;

  private _inGameStatus: Observable<any>;
  private _baseText$: Observable<any>;
  private _roomBase$: Observable<any>;
  private _objOrPerson$: Observable<any>;
  private _genericPage$: Observable<any>;

  output = [];
  outputObservable = new BehaviorSubject([]);

  lastRoomDescription = '';
  typeDetail: string;
  objPersDetail: any[];
  genericPage: IGenericPage;


  private resizeID: any;
  private readonly outputTrimLines = 500;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private outputService: OutputService,
    private store: Store<TGState>,
    private game: GameService,
    private _configService: ConfigService) {

    this.lastRoom$ = this.store.select(getRoomBase);
    this._inGameStatus = this.store.select(getInGameStatus);
    this._baseText$ = this.store.select(getDataBase);
    this._roomBase$ = this.store.select(getRoomBase);
    this._objOrPerson$ = this.store.select(getObjOrPerson);
    this._genericPage$ = this.store.select(getGenericPage);

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // Subscribe to config changes
    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.tgConfig = config;
      });


    this._inGameStatus
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((status) => {
        if (status === false) {
          this.output = [];
        }
      });

    this.outputService.toggledAutoScroll
      .subscribe(pauseScroll => this.pauseScroll = pauseScroll);


    /* Check login status and if is disconnect cleaning the output messages */
    // Listen Base Text Data
    this._baseText$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((base: string[]) => this.updateBaseText(base));

    this._roomBase$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((room: Room) => {
        this.typeDetail = 'room';
        this.updateRoomBase(room);
      });

    /** Object or Person Detail */
    this._objOrPerson$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((elements: any) => this.updateObjectOrPerson(elements));

    this._genericPage$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => this.updateGenericPage(data));




    setTimeout(() => {
      this.setOutputSplit();
    });
  }


  private setContent(t: string, c: any): any {
    const content = Object.assign({}, { type: t, content: c });
    this.trimOutput();
    this.output.push(content);
    this.outputObservable.next(this.output);
    this.scrollPanelToBottom();
  }

  private updateBaseText(base: string[]) {
    if (base)
      this.setContent('base', base[0]);
  }

  private updateRoomBase(room: Room) {
    if (room) {
      if (room.desc['base'] !== undefined && room.desc['base'] !== '') {
        this.lastRoomDescription = room.desc['base'];
      }

      this.setContent('room', room);

      if (this.game.client_update.room.version < room.ver) {
        this.game.client_update.room.version = room.ver;
        this.game.client_update.room.needed = false;
      }
    }
  }

  private updateObjectOrPerson(elements: any) {
    if (elements) {

      this.typeDetail = 'objPersDetail';
      this.objPersDetail = elements;
      this.setContent(this.typeDetail, this.objPersDetail);

      // save last container if we need to update his view
      this.game.client_update.mrnContainer = elements.num;
      this.game.client_update.inContainer = true;
    }
  }

  private updateGenericPage(data: any) {
    if (!!data) {
      this.genericPage = data;
      this.setContent('genericPage', this.genericPage);
    }
  }

  private trimOutput(): void {
    if (this.output.length > this.outputTrimLines) {
      this.output = this.output.slice(1, this.output.length);
    }
  }

  private scrollPanelToBottom() {
    setTimeout(() => {
      this.scrollBar.scrollToElement(this.scrollerEnd.nativeElement, 0, 50);
    }, 100);
  }

  @HostListener('window:resize', ['$event.target'])
  onResize() {
    clearInterval(this.resizeID);
    this.resizeID = setTimeout(() => {
      this.setOutputSplit();
    }, 500);
  }

  setOutputSplit() {
    // Check if the Output area is over min-size to show split.
    if (this.mainOutputArea.nativeElement.offsetWidth < 639) {
      this.showExtraByViewport = this.game.showExtraByViewport = false;
    } else {
      this.showExtraByViewport = this.game.showExtraByViewport = true;
    }
  }

  onDragStart() {
    // TODO disable ngx-scrollbar to improve performance
  }

  onDragEnd(event, selector: string) {
    this.scrollBar.sensorDisabled = false;
    this.scrollBar.update();
    this.scrollPanelToBottom();
    // Store the Split size in the main config

    if(selector === 'output') {
      this._configService.setConfig({
        output: { extraArea: { size: [event.sizes[0], event.sizes[1]] } }
      });
    }
    else if (selector === 'equipinv') {
      console.log(event);
      this._configService.setConfig({
        equipInventoryBox: { size: event.sizes[1] }
      });
    }

  }

  toggleEquipInventorySplit(event) {
    this._configService.setConfig({
      equipInventoryBox: { visible: false}
    })
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
