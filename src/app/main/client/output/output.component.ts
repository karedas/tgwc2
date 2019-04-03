import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import * as fromSelectors from 'src/app/store/selectors';
import { filter, takeUntil } from 'rxjs/operators';
import { NgScrollbar } from 'ngx-scrollbar';
// import { jqxSplitterComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';
import { Observable, Subject } from 'rxjs';
import { getDataBase, getRoomBase, getObjOrPerson, getGenericPage } from 'src/app/store/selectors';
import { GameService } from 'src/app/main/client/services/game.service';
import { Room } from 'src/app/models/data/room.model';
import { SplitComponent } from 'angular-split';
import { LoginService } from '../../authentication/services/login.service';
import { IGenericPage } from 'src/app/models/data/genericpage.model';
import { ConfigService } from 'src/app/services/config.service';
import { TGConfig } from '../client-config';

@Component({
  selector: 'tg-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss'],
})

export class OutputComponent implements OnInit, AfterViewInit, OnDestroy {

  tgConfig: TGConfig;

  @ViewChild('scrollBar') scrollBar: NgScrollbar;
  @ViewChild('mainOutputArea') mainOutputArea: ElementRef;
  @ViewChild('splitArea') splitArea: SplitComponent;

  lastRoom$: Observable<any>;
  showExtraByViewport: boolean;

  private _baseText$: Observable<any>;
  private _roomBase$: Observable<any>;
  private _objOrPerson$: Observable<any>;
  private _genericPage$: Observable<any>;

  output: any = [];
  lastRoomDescription = '';
  typeDetail: string;
  objPersDetail: any[];
  genericPage: IGenericPage;


  private resizeID: any;
  private outputTrimLines = 500;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private loginService: LoginService,
    private game: GameService,
    private _configService: ConfigService) {

    this.lastRoom$ = this.store.select(fromSelectors.getRoomBase);

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

    /* Check login status and if is disconnect cleaning the output messages */
    this.loginService.isLoggedIn
      .pipe(
        takeUntil(this._unsubscribeAll))
      .subscribe((status) => {
        if (status === false) {
          this.output = [];
        }
      });

    // Listen Base Text Data
    this._baseText$
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter(text => text && text !== undefined))
      .subscribe(
        (base: string[]) => {
          const content = this.setContent('base', base[0]);
          this.output.push(content);
          // You might need to give a tiny delay before updating the scrollbar
          this.endOutputStore();
        },
      );

    this._roomBase$
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter(room => room && room !== undefined))
      .subscribe((room: Room) => {
        if (room.desc['base'] !== undefined && room.desc['base'] !== '') {
          this.lastRoomDescription = room.desc['base'];
        }
        this.typeDetail = 'room';
        const content = this.setContent('room', room);
        this.output.push(content);
        this.endOutputStore();

        if (this.game.client_update.room.version < room.ver) {
          this.game.client_update.room.version = room.ver;
          this.game.client_update.room.needed = false;
        }

        this.game.client_update.inContainer = false;
      });

    /** Object or Person Detail */
    this._objOrPerson$
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter(elements => elements && elements !== undefined))
      .subscribe((elements: any) => {
        this.objPersDetail = elements;
        const content = this.setContent('objpersdetail', this.objPersDetail);
        this.output.push(content);
        this.typeDetail = 'objPers';
        this.endOutputStore();
        // save last container if we need to update his view
        this.game.client_update.mrnContainer = elements.num;
        this.game.client_update.inContainer = true;
      });

    this._genericPage$
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter(data => !!data)).subscribe(data => {
          this.genericPage = data;
          const content = this.setContent('genericpage', this.genericPage);
          this.output.push(content);
          this.endOutputStore();
        });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setOutputSplit();
    });
  }

  private setContent(t: string, c: any): any {
    return Object.assign({}, { type: t, content: c });
  }

  private trimOutput(): void {
    if (this.output.length > this.outputTrimLines) {
      this.output = this.output.slice(1, this.output.length);
    }
  }

  private scrollPanelToBottom() {
    setTimeout(() => {
      this.scrollBar.scrollToBottom(0).subscribe();
    }, 50);
  }

  private endOutputStore() {
    this.trimOutput();
    this.scrollPanelToBottom();
  }

  @HostListener('window:resize', ['$event.target'])
  onResize() {
    clearInterval(this.resizeID);
    this.resizeID = setTimeout(() => {
      this.setOutputSplit();
    }, 500);
  }

  setOutputSplit() {
    if (this.mainOutputArea.nativeElement.offsetWidth < 639) {
      this.showExtraByViewport = false;
    } else {
      this.showExtraByViewport = true;
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
