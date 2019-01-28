import { Component, OnInit, SimpleChange, ChangeDetectionStrategy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { DialogService } from 'src/app/main/common/dialog/dialog.service';
import { select, Store } from '@ngrx/store';
import { getGenericTable } from 'src/app/store/selectors';
import { DataState } from 'src/app/store/state/data.state';
import { IGtable } from 'src/app/models/data/generictable.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ModalConfiguration } from 'src/app/main/common/dialog/model/modal.interface';

@Component({
  selector: 'tg-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GenericTableComponent implements OnInit {

  @ViewChild('tgdatatable') table: DatatableComponent;
  public readonly dialogID: string = 'genericTable';
  public dataTable$: Observable<any>;
  public modalConfig: ModalConfiguration = new ModalConfiguration;

  public rows = [];
  public columns = [];
  public currentPageLimit = 10;
  public currentVisible = 3;
  public messages = {
      // Footer total message
      totalMessage: 'Totali'
    };

  public readonly pageLimitOptions = [
    {value: 5},
    {value: 10},
    {value: 25},
    {value: 50},
    {value: 100},
  ];
  public readonly visibleOptions = [
    {value: 1},
    {value: 3},
    {value: 5},
    {value: 10},
  ];



  constructor(
    private dialogService: DialogService,
    private store: Store<DataState>
  ) {
    this.modalConfig.draggable = true;
    this.modalConfig.isModal = false;
    this.modalConfig.minHeight = 300;
    this.modalConfig.height = 'auto';
  }

  ngOnInit() {
    this.dataTable$ = this.store.pipe(select(getGenericTable));


    this.dataTable$.subscribe(

      (dt: IGtable) => {
        if (dt) {
          this.populate(dt);
          // this.populateRows = dt.data;
          this.open();
        }
      });
  }

  private populate(dataTable: any) {

    this.rows = [];
    this.columns = [];

    if (dataTable.head) {
      dataTable.head.forEach((v: any, i: number) => {
        switch (typeof v) {
          case 'object':
            this.columns.push({ prop: 'prop_' + i, 'name': v.title.toLowerCase() });
            break;
          default:
            this.columns.push({ prop: 'prop_' + i, 'name': v.toLowerCase() });
            break;
        }
      });
    }
    if (dataTable.data) {
      dataTable.data.forEach((d: any) => {
        const obj = {};
        d.map((row: string, rowIndex: number) => {
          obj[this.columns[rowIndex].prop] = row;
        });
        this.rows.push(obj);
      });
    }
  }

  private close() {
    this.dialogService.close(this.dialogID);
  }


  private open() {
    setTimeout(() => {
      this.dialogService.open(this.dialogID);
      this.dialogService.toFront(this.dialogID);
    }, 200);

  }
}
