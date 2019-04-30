import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { getWorksList } from 'src/app/store/selectors';
import { takeUntil } from 'rxjs/operators';
import { IWorks, IWorksList } from 'src/app/models/data/workslist.model';
import { GameService } from 'src/app/main/client/services/game.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';


export interface WorksListElement {
  id: number,
  icon: number,
  diff: string,
  cando: string,
  desc: string,
  action: any
}

@Component({
  selector: 'tg-workslist',
  templateUrl: './workslist.component.html',
  styleUrls: ['./workslist.component.scss'],
})
export class WorkslistComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  pageSizeBase = 10;
  dataSource:  MatTableDataSource<any>;
  columnsToDisplay: string[] = ['id', 'icon', 'diff', 'cando', 'desc', 'cmd'];
  resultsLength = 0;
  headerTitle: string = '';

  dataTable$: Observable<any>;

  private data = [];
  private cmd: string;
  private _unsubscribeAll: Subject<any>;


  constructor(
    private store: Store<DataState>,
    private game: GameService,
    ) {
      this.dataTable$ = this.store.pipe(select(getWorksList));
      this._unsubscribeAll = new Subject;
     }

  ngOnInit(): void {

    this.dataTable$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (wl: IWorks) => {
          if (wl) {
            this.setHeaderTitle(wl.verb)
            this.cmd = wl.cmd;
            this.resultsLength = Object.keys(wl.list).length;
            this.populate(wl.list);
          }
      });
  }

  setHeaderTitle(verb) {
    this.headerTitle =  `Cosa sai ${verb}`;;
  }

  private populate(data: any) {
    if (data) {
      data.forEach((d: any) => {
        const obj = {};
          this.data.push(d);
      });

      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }


  onAction(index: number, event: Event) {
    event.preventDefault();
    if (this.cmd) {
      this.game.processCommands(this.cmd + ' ' + (index + 1));
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
