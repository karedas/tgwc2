import { Component, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IBook } from 'src/app/models/data/book.model';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { MAT_DIALOG_DATA } from '@angular/material';
// import { WindowsService } from '../windows.service';

@Component({
  selector: 'tg-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent {

  dialogID = 'book';

  total: number;
  openedIndexPage = 0;
  book$: Observable<IBook>;

  constructor(
    private store: Store<DataState>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.openedIndexPage = data.index
    this.total = data.pages.length;
  }

  nextPage() {
    if ((this.openedIndexPage + 1) < this.total) {
      ++this.openedIndexPage;
    }
  }
  previousPage() {
    if (this.openedIndexPage !== 0 && this.openedIndexPage <= this.total) {
      this.openedIndexPage--;
    }
  }
}
