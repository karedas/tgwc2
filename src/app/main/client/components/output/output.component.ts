import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {MediaObserver} from '@angular/flex-layout';
import {Store} from '@ngrx/store';
import {SplitComponent} from 'angular-split';
import {NgScrollbar} from 'ngx-scrollbar';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {filter, takeUntil, delay} from 'rxjs/operators';
import {IGenericPage} from 'src/app/main/client/models/data/genericpage.model';
import {Room} from 'src/app/main/client/models/data/room.model';
import {GameService} from 'src/app/main/client/services/game.service';
import * as dataSelector from 'src/app/main/client/store/selectors';
import {ConfigService} from 'src/app/services/config.service';

import {TGConfig} from '../../client-config';
import {TGState} from '../../store';
import {OutputService} from './services/output.service';

@Component({
  selector: 'tg-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollBar', {static: false}) scrollBar: NgScrollbar;
  @ViewChild('scrollerEnd', {static: false}) scrollerEnd: ElementRef;
  @ViewChild('mainOutputArea', {static: false}) mainOutputArea: ElementRef;
  @ViewChild('splitArea', {static: false}) splitArea: SplitComponent;

  tgConfig: TGConfig;
  draggingSplitArea = false;
  pauseScroll = false;
  output = [];
  lastRoom$: Observable<any>;
  outputObservable = new BehaviorSubject([]);
  lastRoomDescription = '';
  typeDetail: string;
  objPersDetail: any[];
  genericPage: IGenericPage;

  private readonly outputTrimLines = 500;
  private _inGameStatus: Observable<any>;
  private _baseText$: Observable<any>;
  private _roomBase$: Observable<any>;
  private _objOrPerson$: Observable<any>;
  private _genericPage$: Observable<any>;

  private _unsubscribeAll: Subject<any>;

  // Todo move to service
  get haveWidgets() {
    if (this.tgConfig.widgetRoom.visible) {
      return true;
    }
    if (this.tgConfig.widgetEquipInv.visible) {
      return true;
    }
    if (this.tgConfig.widgetCombat.visible) {
      return true;
    }
    return false;
  }

  constructor(
    private outputService: OutputService,
    private store: Store<TGState>,
    private game: GameService,
    private _configService: ConfigService,
    public mediaObserver: MediaObserver
  ) {
    this.lastRoom$ = this.store.select(dataSelector.getRoomBase);
    this._inGameStatus = this.store.select(dataSelector.getInGameStatus);
    this._baseText$ = this.store.select(dataSelector.getDataBase);
    this._roomBase$ = this.store.select(dataSelector.getRoomBase);
    this._objOrPerson$ = this.store.select(dataSelector.getObjOrPerson);
    this._genericPage$ = this.store.select(dataSelector.getGenericPage);

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: TGConfig) => (this.tgConfig = config));

    this.addOutputSubscriptions();
  }

  ngAfterViewInit(): void {
    this.addScrollbarBehaviour();
  }

  private addScrollbarBehaviour() {
    this.outputService
      .isScrollable()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pauseScroll: boolean) => (this.pauseScroll = pauseScroll));
/*
    // Listen Mouse Scroll event to enable/disable pause.
    this.scrollBar.scrolled.pipe(delay(250)).subscribe(e => {
      const outputSize =
        this.mainOutputArea.nativeElement.offsetHeight +
        this.mainOutputArea.nativeElement.offsetWidth;

      this.outputService.onMouseScroll(
        e.target.scrollTop,
        outputSize,
        this.tgConfig.widgetRoom.visible
      );
    });*/
  }

  private addOutputSubscriptions() {
    this._baseText$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((base: string[]) => this.updateBaseText(base));

    this._roomBase$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((room: Room) => {
        this.updateRoomBase(room);
      });

    this._objOrPerson$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((elements: any) => this.updateObjectOrPerson(elements));

    this._genericPage$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => this.updateGenericPage(data));

    this._inGameStatus
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter(status => {
          return status === false;
        })
      )
      .subscribe(() => {
        this.output = [];
      });
  }

  private setContent(t: string, c: any): any {
    const content = Object.assign({}, {type: t, content: c});
    this.trimOutput();
    this.output.push(content);
    this.outputObservable.next(this.output);
    if (!this.pauseScroll) {
      this.outputService.scrollPanelToBottom(this.scrollBar, this.scrollerEnd);
    }
  }

  private updateBaseText(base: string[]) {
    if (base) {
      this.setContent('base', base[0]);
    }
  }

  private updateRoomBase(room: Room) {
    if (room) {
      if (
        room.mv &&
        this.game.client_update.inContainer &&
        this.tgConfig.widgetRoom.visible
      ) {
        return;
      }

      this.typeDetail = 'room';
      this.game.client_update.inContainer = false;

      if (room.desc.base !== undefined && room.desc.base !== '') {
        this.lastRoomDescription = room.desc.base;
      }

      if (this.game.client_update.room.version < room.ver) {
        this.game.client_update.room.version = room.ver;
        this.game.client_update.room.needed = false;
      }

      this.setContent(this.typeDetail, room);
    }
  }

  private updateObjectOrPerson(elements: any) {
    if (elements) {
      this.typeDetail = 'objPersDetail';
      this.objPersDetail = elements;
      // save last container if we need to update his view
      this.game.client_update.mrnContainer = elements.num;
      this.game.client_update.inContainer = true;

      this.setContent(this.typeDetail, this.objPersDetail);
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

  onBottomReached() {
    this.outputService.resetScrollTopPause();
    this.outputService.disablePause();
  }

  resumeScroll() {
    this.outputService.scrollPanelToBottom(this.scrollBar, this.scrollerEnd);
    this.pauseScroll = !this.pauseScroll;
  }

  onDragStart() {
    this.draggingSplitArea = true;
  }

  onDragEnd(event, selector: string) {
    this.scrollBar.update();
    this.outputService.scrollPanelToBottom(this.scrollBar, this.scrollerEnd);
    // Store the Split size in the main config
    if (selector === 'output') {
      this._configService.setConfig({
        output: {extraArea: {size: [event.sizes[0], event.sizes[1]]}}
      });
    } else if (selector === 'widgets') {
      if (!this.tgConfig.widgetEquipInv.collapsed) {
        this._configService.setConfig({
          widgetRoom: {size: event.sizes[0]},
          widgetEquipInv: {size: event.sizes[1]}
        });
      }
    }

    this.draggingSplitArea = false;
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
