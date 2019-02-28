import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import * as fromSelectors from 'src/app/store/selectors';
import { filter, takeUntil } from 'rxjs/operators';
import { NgScrollbar } from 'ngx-scrollbar';
// import { jqxSplitterComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';
import { Observable, Subject } from 'rxjs';
import { getExtraOutputStatus, getDataBase, getRoomBase, getObjOrPerson, getGenericPage } from 'src/app/store/selectors';
import { GameService } from 'src/app/services/game.service';
import { Room } from 'src/app/models/data/room.model';
import { SplitComponent } from 'angular-split';
import { ToggleExtraOutput } from 'src/app/store/actions/ui.action';
import { LoginService } from '../../authentication/services/login.service';
import { MenuItem } from 'primeng/api';
import { IGenericPage } from 'src/app/models/data/genericpage.model';

@Component({
  selector: 'tg-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss'],
})

export class OutputComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('scrollBar') scrollBar: NgScrollbar;
  @ViewChild('mainOutputArea') mainOutputArea: ElementRef;
  @ViewChild('splitArea') splitArea: SplitComponent;

  private TEST: MenuItem[];

  lastRoom$: Observable<any>;

  public extraOutputOpenStatus$: Observable<any>;
  private _baseText$: Observable<any>;
  private _roomBase$: Observable<any>;
  private _objOrPerson$: Observable<any>;
  private _genericPage$: Observable<any>;

  output: any = [];
  lastRoomDescription = '';
  typeDetail: string;
  objPersDetail: any[];
  genericPage: IGenericPage;

  private _unsubscribeAll: Subject<any>;

  private resizeID: any;
  private outputTrimLines = 500;

  constructor(
    private store: Store<DataState>,
    private loginService: LoginService,
    private game: GameService) {

    this.extraOutputOpenStatus$ = this.store.select(getExtraOutputStatus);

    this.lastRoom$ = this.store.select(fromSelectors.getRoomBase);

    this._baseText$ = this.store.select(getDataBase);
    this._roomBase$ = this.store.select(getRoomBase);
    this._objOrPerson$ = this.store.select(getObjOrPerson);
    this._genericPage$ = this.store.select(getGenericPage);
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    /* Check login status and if is disconnect cleaning the output messages */
    this.loginService.isLoggedIn.pipe(
      takeUntil(this._unsubscribeAll)).subscribe((status) =>  {
       if (status === false) {
         this.output = [];
       }}
    );

    /** Toggle Splitter Output  view  */
    this.extraOutputOpenStatus$.pipe(
      takeUntil(this._unsubscribeAll))
        .subscribe((extra_status) => {
          this.game.extraIsOpen = extra_status;
          this.scrollPanelToBottom();
        });

    // Listen Base Text Data
    this._baseText$.pipe(
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

    this._roomBase$.pipe(
      takeUntil(this._unsubscribeAll),
      filter(room => room && room !== undefined))
        .subscribe(
          (room: Room) => {

            console.log('room REQUEST', room);

            if (room.desc['base'] !== undefined && room.desc['base'] !== '') {
              this.lastRoomDescription = room.desc['base'];
            }
            this.typeDetail = 'room';
            const content = this.setContent('room', room);
            this.output.push(content);
            this.endOutputStore();
            
            if(this.game.client_update.room.version < room.ver) {
              this.game.client_update.room.version = room.ver;
              this.game.client_update.room.needed = false;
            }

            this.game.client_update.inContainer = false;
          }
        );

    /** Object or Person Detail */
    this._objOrPerson$.pipe(
      takeUntil(this._unsubscribeAll),
      filter(elements => elements && elements !== undefined ))
        .subscribe( (elements: any) => {

          console.log('im in objorPerson!!'); 

          this.objPersDetail = elements;
          const content = this.setContent('objpersdetail', this.objPersDetail);
          this.output.push(content);
          this.typeDetail = 'objPers';
          this.endOutputStore();
          
          this.game.client_update.inContainer = true;

          // if(this.game.client_update.equipment.version < elements.ver) {
          //   this.game.client_update.room.version = elements..ver;
          //   this.game.client_update.room.needed = false;
          // }
          // if(this.game.client_update.inventory.version < room.ver) {
          //   this.game.client_update.room.version = room.ver;
          //   this.game.client_update.room.needed = false;
          // }
        });

    this._genericPage$.pipe(
      takeUntil(this._unsubscribeAll),
      filter(data => !!data)).subscribe(data => {
        this.genericPage = data;
        const content = this.setContent('genericpage', this.genericPage);
        this.output.push(content);
        this.endOutputStore();
      });
  }

  ngAfterViewInit() {
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
      this.store.dispatch(new ToggleExtraOutput(false));
    } else {
      this.store.dispatch(new ToggleExtraOutput(true));
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
