import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import * as fromSelectors from 'src/app/store/selectors';
import { filter, takeUntil } from 'rxjs/operators';
import { NgScrollbar } from 'ngx-scrollbar';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { getDataBase, getRoomBase, getObjOrPerson, getGenericPage } from 'src/app/store/selectors';
import { GameService } from 'src/app/main/client/services/game.service';
import { Room } from 'src/app/main/client/models/data/room.model';
import { SplitComponent } from 'angular-split';
import { IGenericPage } from 'src/app/main/client/models/data/genericpage.model';
import { ConfigService } from 'src/app/services/config.service';
import { TGConfig } from '../../client-config';
import { LoginClientService } from 'src/app/main/client/services/login-client.service';


@Component({
  selector: 'tg-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss'],
})

export class OutputComponent implements OnInit, AfterViewInit, OnDestroy {

  tgConfig: TGConfig;

  @ViewChild('scrollBar', {static: false}) scrollBar: NgScrollbar;
  @ViewChild('mainOutputArea', {static: true}) mainOutputArea: ElementRef;
  @ViewChild('splitArea', {static: true}) splitArea: SplitComponent;

  lastRoom$: Observable<any>;
  showExtraByViewport: boolean;

  private _baseText$: Observable<any>;
  private _roomBase$: Observable<any>;
  private _objOrPerson$: Observable<any>;
  private _genericPage$: Observable<any>;

  output = Array();


    states = [
      { name: 'Alabama', capital: 'Montgomery' },
      { name: 'Alaska', capital: 'Juneau' },
      { name: 'Arizona', capital: 'Phoenix' },
      { name: 'Arkansas', capital: 'Little Rock' },
      { name: 'California', capital: 'Sacramento' },
      { name: 'Colorado', capital: 'Denver' },
      { name: 'Connecticut', capital: 'Hartford' },
      { name: 'Delaware', capital: 'Dover' },
      { name: 'Florida', capital: 'Tallahassee' },
      { name: 'Georgia', capital: 'Atlanta' },
      { name: 'Hawaii', capital: 'Honolulu' },
      { name: 'Idaho', capital: 'Boise' },
      { name: 'Illinois', capital: 'Springfield' },
      { name: 'Indiana', capital: 'Indianapolis' },
      { name: 'Iowa', capital: 'Des Moines' },
      { name: 'Kansas', capital: 'Topeka' },
      { name: 'Kentucky', capital: 'Frankfort' },
      { name: 'Louisiana', capital: 'Baton Rouge' },
      { name: 'Maine', capital: 'Augusta' },
      { name: 'Maryland', capital: 'Annapolis' },
      { name: 'Massachusetts', capital: 'Boston' },
      { name: 'Michigan', capital: 'Lansing' }
    ];

  outputObservable = new BehaviorSubject(this.output);

  lastRoomDescription = '';
  typeDetail: string;
  objPersDetail: any[];
  genericPage: IGenericPage;


  private resizeID: any;
  private outputTrimLines = 500;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private loginClientService: LoginClientService,
    private game: GameService,
    private _configService: ConfigService) 
  
  {
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
    // Listen Base Text Data
    this._baseText$
      .pipe( takeUntil(this._unsubscribeAll)) 
      .subscribe( (base: string[]) => this.updateBaseText(base));

    this._roomBase$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((room: Room) => this.updateRoomBase(room) );

    /** Object or Person Detail */
    this._objOrPerson$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((elements: any) => this.updateObjectOrPerson(elements));

    this._genericPage$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => this.updateGenericPage(data));
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setOutputSplit();
    });
  }

  private updateBaseText(base: string[]) {
    if(base) {
      const content = this.setContent('base', base[0]);
      this.output.push(content);
      // You might need to give a tiny delay before updating the scrollbar
      this.scrollPanelToBottom();
      this.outputObservable.next(this.output);
    }
  }

  private updateRoomBase(room: Room) {
    if(room) {
      this.typeDetail = 'room';

      if (room.desc['base'] !== undefined && room.desc['base'] !== '') {
        this.lastRoomDescription = room.desc['base'];
      }

      this.output.push(this.setContent('room', room));
      this.scrollPanelToBottom();
      this.game.client_update.inContainer = false;

      if (this.game.client_update.room.version < room.ver) {
        this.game.client_update.room.version = room.ver;
        this.game.client_update.room.needed = false;
      }
    }
  }

  private updateObjectOrPerson(elements: any) {
    if(elements) {
      this.objPersDetail = elements;
      const content = this.setContent('objpersdetail', this.objPersDetail);
      this.output.push(content);
      this.typeDetail = 'objPers';
      this.scrollPanelToBottom();

      // save last container if we need to update his view
      this.game.client_update.mrnContainer = elements.num;
      this.game.client_update.inContainer = true;
    }
  }

  private updateGenericPage(data: any) {
    if(!!data) {
      this.genericPage = data;
      const content = this.setContent('genericpage', this.genericPage);
      this.output.push(content);
      this.scrollPanelToBottom();
    }
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
    return;
    this.trimOutput();
    setTimeout(() => {
      this.scrollBar.scrollToBottom(0).subscribe();
    }, 50);
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

  onDragEnd(event) {
    // Store the Split size in the main config
    this._configService.setConfig({
      output: { extraArea: { size: [event.sizes[0], event.sizes[1]] } }
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
