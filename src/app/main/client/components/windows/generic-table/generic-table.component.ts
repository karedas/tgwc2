import { Component,  OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getGenericTable } from 'src/app/main/client/store/selectors';
import { DataState } from 'src/app/main/client/store/state/data.state';
import { IGenericTable } from 'src/app/main/client/models/data/generictable.model';
import { takeUntil } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'tg-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
})

export class GenericTableComponent implements  OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  dataTable$: Observable<any>;
  pageSizeBase = 5;
  private data = [];

  dataSource: MatTableDataSource<any>;
  columnsToDisplay: string[];
  resultsLength = 0;
  headerTitle = 'Lista Generica';

  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
  ) {

    this.dataTable$ = this.store.pipe(select(getGenericTable));

    this._unsubscribeAll = new Subject;
  }

  ngOnInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    this.dataTable$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (dt: IGenericTable) => {
          if (dt) {
            this.setHeaderTitle(dt.title);
            this.resultsLength = Object.keys(dt.data).length;
            this.populate(dt);
          }
      });
  }

  setHeaderTitle(title) {
    this.headerTitle = title ? title : 'Informazioni';
  }

  private populate(dataTable: any) {

    this.columnsToDisplay = [];
    this.data = [];

    if (dataTable.head) {
      dataTable.head.forEach((v: any, i: number) => {
        switch (typeof v) {
          case 'object':
            this.columnsToDisplay.push(v.title.toLowerCase());
            break;
          default:
            this.columnsToDisplay.push(v.toLowerCase());
            break;
        }
      });
    } else {
      dataTable.data.forEach((d: any,  idx) => {
        this.columnsToDisplay.push(d[0]);
      });
    }

    // pupulate data
    if (dataTable.data) {
      let obj = {};
      dataTable.data.forEach((d: any, idx) => {
        if (dataTable.head) {
          obj = {};
          d.map((row: string, rowIndex: number) => {
              obj[this.columnsToDisplay[rowIndex]] = row;
          });
          this.data.push(obj);
        } else {
          obj[d[0]] = d[1];
        }
      });

      if (!dataTable.head) {
        this.data.push(obj);
      }
    }
    this.dataSource = new MatTableDataSource(this.data);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

