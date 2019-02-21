import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IBook } from 'src/app/models/data/book.model';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { getBook } from 'src/app/store/selectors';
import { takeUntil } from 'rxjs/operators';
import { WindowsService } from '../windows.service';

@Component({
  selector: 'tg-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements AfterViewInit, OnDestroy {

  dialogID: string = 'book';

  page: 0;
  book$: Observable<IBook>;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private windowsService: WindowsService
  ) {
    this.book$ = this.store.pipe(select(getBook));
    this._unsubscribeAll = new Subject<any>();
  }

  ngAfterViewInit() {
    this.book$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (book: IBook) => {
        if (book) {
          setTimeout(() => {
            this.windowsService.openBook(this.dialogID)
          });
        }
      }
    );
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
