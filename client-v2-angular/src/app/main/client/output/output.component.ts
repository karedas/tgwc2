import { Component, ViewChild, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import * as fromSelectors from 'src/app/store/selectors';
import { filter, map, takeUntil } from 'rxjs/operators';
import { NgScrollbar } from 'ngx-scrollbar';
import { jqxSplitterComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { UIState } from 'src/app/store/state/ui.state';

@Component({
  selector: 'tg-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss'],
})

export class OutputComponent implements OnInit, OnDestroy {

  @ViewChild('scrollBar') scrollBar: NgScrollbar;
  @ViewChild('nestedSplitter') splitterpanel: jqxSplitterComponent;

  output: any = [];
  lastRoom$: Observable<any>;
  extraDetail$: BehaviorSubject<boolean>;
  lastRoomDescription: string = '';

  
  private _unsubscribeAll: Subject<any>;


  private outputTrimLines = 500;


  constructor(private store: Store<DataState>, private cd: ChangeDetectorRef) {
    this.lastRoom$ = this.store.pipe(select(fromSelectors.getRoomBase));
    this.extraDetail$ = new BehaviorSubject(false);

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    /** Toggle Splitter Output  view  */
    this.store.pipe(
      takeUntil(this._unsubscribeAll),
      select(fromSelectors.getUIState),
      map((ui: UIState) => ui.extraOutput)
    ).subscribe(
      toggleStatus => {
        this.extraDetail$.next(toggleStatus)
        this.scrollPanelToBottom();
      }
    );


    // Listen Base Text Data
    this.store.pipe(
      takeUntil(this._unsubscribeAll),
      select(fromSelectors.getDataBase))
      .subscribe(
        (base: string[]) => {
          const content = this.setContent('base', base[0]);
          this.output.push(content);
          // You might need to give a tiny delay before updating the scrollbar
          this.scrollPanelToBottom();
        },
      );

    this.store.pipe(
      takeUntil(this._unsubscribeAll),
      select(fromSelectors.getRoomBase),
      filter(room => room && room !== undefined))
      .subscribe(
        (room: any) => {
          if (room.desc.base != undefined && room.desc.base != '') {
            this.lastRoomDescription = room.desc.base;
          }
          const content = this.setContent('room', room);
          this.output.push(content);
          this.trimOutput();
          this.scrollPanelToBottom();
        }
      );
  }


  get isWithExtra(): Observable<any> {
    return this.extraDetail$.asObservable();
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
    }, 15);
  }


  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
