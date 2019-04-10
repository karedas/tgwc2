import { Component,  OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getGenericTable } from 'src/app/store/selectors';
import { DataState } from 'src/app/store/state/data.state';
import { IGenericTable } from 'src/app/models/data/generictable.model';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tg-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
})

export class GenericTableComponent implements  OnInit, OnDestroy {



  public readonly dialogID: string = 'genericTable';

  public dataTable$: Observable<any>;
  public rows = [];
  public columns = [];
  public currentPageLimit = 10;
  public headerTitle: string = 'Lista Generica';

  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
  ) {

    this.dataTable$ = this.store.pipe(select(getGenericTable));

    this._unsubscribeAll = new Subject;
  }

  ngOnInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    this.dataTable$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (dt: IGenericTable) => {
        console.log(dt);
        if (dt) {
          this.setHeaderTitle(dt.title);
          // if (this.table ) {
          //   this.table.reset();
          // }
          this.populate(dt);
        }
      });
  }

  setHeaderTitle(title) {
    this.headerTitle = title ? title : 'Informazioni';
  }

  private populate(dataTable: any) {

    this.rows = [];
    this.columns = [];

    if (dataTable.head) {
      dataTable.head.forEach((v: any, i: number) => {
        switch (typeof v) {
          case 'object':
            this.columns.push({ field: 'prop_' + i, 'name': v.title.toLowerCase() });
            break;
          default:
            this.columns.push({ field: 'prop_' + i, 'name': v.toLowerCase() });
            break;
        }
      });
    }
    if (dataTable.data) {
      dataTable.data.forEach((d: any) => {
        const obj = {};
        d.map((row: string, rowIndex: number) => {
          obj[this.columns[rowIndex].field] = row;
        });
        this.rows.push(obj);
      });
    }
  }

  // private open() {
  //   setTimeout(() => {
  //     // this.windowsService.openDialogTable(this.dialogID, this.headerTitle);
  //   }, 200);

  // }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

