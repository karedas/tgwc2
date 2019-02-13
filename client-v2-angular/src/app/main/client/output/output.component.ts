import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import * as fromSelectors from 'src/app/store/selectors';
import { filter, takeUntil } from 'rxjs/operators';
import { NgScrollbar } from 'ngx-scrollbar';
// import { jqxSplitterComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';
import { Observable, Subject } from 'rxjs';
import { getExtraOutputStatus, getDataBase, getRoomBase, getObjOrPerson } from 'src/app/store/selectors';
import { GameService } from 'src/app/services/game.service';
import { Room } from 'src/app/models/data/room.model';
import { SplitComponent } from 'angular-split';
import { ToggleExtraOutput } from 'src/app/store/actions/ui.action';
import { LoginService } from '../../authentication/services/login.service';

@Component({
  selector: 'tg-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss'],
})

export class OutputComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('scrollBar') scrollBar: NgScrollbar;
  @ViewChild('mainOutputArea') mainOutputArea: ElementRef;
  @ViewChild('splitArea') splitArea: SplitComponent;

  lastRoom$: Observable<any>;

  extraOutputOpenStatus$: Observable<any>;
  private baseText: Observable<any>;
  private roomBase: Observable<any>;
  private objOrPerson: Observable<any>;

  output: any = [];
  lastRoomDescription = '';
  typeDetail: string;
  objPersDetail: any[];

  private _unsubscribeAll: Subject<any>;

  private resizeID: any;
  private outputTrimLines = 500;

  constructor(
    private store: Store<DataState>,
    private loginService: LoginService,
    private game: GameService) {

    this.extraOutputOpenStatus$ = this.store.select(getExtraOutputStatus);

    this.lastRoom$ = this.store.select(fromSelectors.getRoomBase);
    // this.autoUpdateNeeded = this.store.select(getVersions);

    this.baseText = this.store.select(getDataBase);
    this.roomBase = this.store.select(getRoomBase);
    this.objOrPerson = this.store.select(getObjOrPerson);
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    /* Check login status and if is disconnect cleaning the output messages */
    this.loginService.isLoggedIn.pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe(
      (status) =>  {
       if (status === false) {
         this.output = [];
       }
      }
    );

    /** Toggle Splitter Output  view  */
    this.extraOutputOpenStatus$.pipe(
      takeUntil(this._unsubscribeAll))
        .subscribe(
        () => {
          this.scrollPanelToBottom();
        }
    );

    // Listen Base Text Data
    this.baseText.pipe(
      takeUntil(this._unsubscribeAll),
      filter(text => text && text !== undefined))
        .subscribe(
          (base: string[]) => {
            const content = this.setContent('base', base[0]);
            this.output.push(content);
            // You might need to give a tiny delay before updating the scrollbar
            this.trimOutput();
            this.scrollPanelToBottom();
          },
        );

    this.roomBase.pipe(
      takeUntil(this._unsubscribeAll),
      filter(room => room && room !== undefined))
        .subscribe(
          (room: Room) => {
            if (room.desc['base'] !== undefined && room.desc['base'] !== '') {
              this.lastRoomDescription = room.desc['base'];
            }
            this.typeDetail = 'room';
            const content = this.setContent('room', room);
            this.output.push(content);
            this.trimOutput();
            this.scrollPanelToBottom();

            this.game.clientUpdateNeeded.room = room.ver;

          }
        );

    /** Object or Person Detail */
    this.objOrPerson.pipe(
      takeUntil(this._unsubscribeAll),
      filter(elements => elements && elements !== undefined ))
        .subscribe(
          (elements: any) => {
            this.objPersDetail = elements;
            const content = this.setContent('objpersdetail', elements);
            this.output.push(content);
            this.typeDetail = 'objPers';
            this.trimOutput();
            this.scrollPanelToBottom();
          }
        );
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
