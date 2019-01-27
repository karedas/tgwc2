import { Component, OnInit, SimpleChange, ChangeDetectionStrategy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { ModalConfiguration } from 'src/app/models/client/modal.interface';
import { DialogService } from 'src/app/main/common/dialog/dialog.service';
import { select, Store } from '@ngrx/store';
import { getGenericTable } from 'src/app/store/selectors';
import { DataState } from 'src/app/store/state/data.state';
import { skip, skipWhile, filter } from 'rxjs/operators';
import { IGtable } from 'src/app/models/data/generictable.model';

@Component({
  selector: 'tg-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GenericTableComponent implements OnInit {

  @ViewChild('tgdatatable') table: any;
  dialogID: string = 'genericTable';
  dataTable$: Observable<any>;
  modalConfig: ModalConfiguration = new ModalConfiguration;

  rows = [];
  columns = [];
  messages = {
      // Footer total message
      totalMessage: 'Totali'
    }



  constructor(
    private dialogService: DialogService,
    private store: Store<DataState>
  ) {
    this.modalConfig.draggable = true;
    this.modalConfig.isModal = false;
    this.modalConfig.minHeight = 300;
    this.modalConfig.height = "auto";
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
      dataTable.head.forEach((v: any, i:number) => {
        switch (typeof v) {
          case 'object':
            this.columns.push({ prop: 'prop_' + i, 'name': v.title.toLowerCase() });
            break;
          default:
            this.columns.push({ prop: 'prop_' + i, 'name': v.toLowerCase() });
            break;
        }
      })
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
    }, 200);
  }
}
