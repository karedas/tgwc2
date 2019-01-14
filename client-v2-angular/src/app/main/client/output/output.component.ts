import { Component, ViewChild, AfterViewInit, HostListener, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import * as fromSelectors from 'src/app/store/selectors';
import { filter, map } from 'rxjs/operators';
import { NgScrollbar } from 'ngx-scrollbar';
import { jqxSplitterComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';
import { Observable, BehaviorSubject } from 'rxjs';
import { UIState } from 'src/app/store/state/ui.state';

@Component({
  selector: 'tg-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss'],
})

export class OutputComponent implements AfterViewInit, OnInit {

  @ViewChild('scrollBar') scrollBar: NgScrollbar;
  @ViewChild('nestedSplitter') splitterpanel: jqxSplitterComponent;

  output: any = [];
  lastRoom$: Observable<any>;
  extraDetail$: BehaviorSubject<boolean>;
  lastRoomDescription: string = '';

  private outputTrimLines = 500;


  constructor(private store: Store<DataState>) {
    this.lastRoom$ = this.store.pipe(select(fromSelectors.getRoomBase));
    this.extraDetail$ = new BehaviorSubject(true);
  }

  ngOnInit(): void {

    /** Toggle Splitter Output  view  */
    this.store.pipe(
      select(fromSelectors.getUIState),
      map((ui: UIState) => ui.extraOutput)
    ).subscribe(
      toggleStatus => {
        this.extraDetail$.next(toggleStatus)
        this.scrollPanelToBottom();
      }
    );


    // Listen Base Text Data
    this.store.pipe(select(fromSelectors.getDataBase))
      .subscribe(
        (base: string[]) => {
          const content = this.getContentObject('base', base[0]);
          this.output.push(content);
          // You might need to give a tiny delay before updating the scrollbar
          this.scrollPanelToBottom();
        },
      );

    this.store.select(fromSelectors.getRoomBase)
      .pipe(filter(room => room && room !== undefined))
      .subscribe(
        (room: any) => {
          if (room.desc.base != undefined && room.desc.base != '') {
            this.lastRoomDescription = room.desc.base;
          }
          const content = this.getContentObject('room', room);
          this.output.push(content);
          this.trimOutput();
          this.scrollPanelToBottom();
        }
      );
  }


  ngAfterViewInit() {
  }

  get isWithExtra(): Observable<any> {
    return this.extraDetail$.asObservable();
  }

  private getContentObject(t: string, c: any): any {
    return Object.assign({}, { type: t, content: c });
  }

  private trimOutput(): void {
    if (this.output.length > this.outputTrimLines) {
      this.output = this.output.slice(1, this.output.length);
    }
  }

  private scrollPanelToBottom() {
    setTimeout(() => {
      this.scrollBar.scrollToBottom(0);
    }, 15);
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: Event) {
    const scrWidth = window.innerWidth;
    if (scrWidth < 712) {
      this.extraDetail$.next(false);
    } else {
      this.extraDetail$.next(true);
    }
  }

}
