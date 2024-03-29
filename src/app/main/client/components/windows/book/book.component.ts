import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IBook } from 'src/app/main/client/models/data/book.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { WindowsService } from '../windows.service';

@Component({
  selector: 'tg-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent {

  total: number;
  openedIndexPage = 0;
  book$: Observable<IBook>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.openedIndexPage = data.index;
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
