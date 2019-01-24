import { Component, OnInit, SimpleChange, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericTableComponent implements OnInit {


  dialogID: string = 'genericTable';
  dataTable$: Observable<any>;
  modalConfig: ModalConfiguration = new ModalConfiguration;

  rows = [];
  columns = [];


  constructor(
    private dialogService: DialogService,
    private store: Store<DataState>
    ) { 
    this.modalConfig.draggable = true;
    this.modalConfig.isModal = false;
    this.modalConfig.height = '300px';
  }

  ngOnInit() {
    this.dataTable$ = this.store.pipe(select(getGenericTable));

        
    this.dataTable$.subscribe(
      (dt: IGtable) => {
        if(dt) {
          this.populateColumns(dt.head);
          this.populateRows = dt.data;
          this.open();
        }
    });
  }

  private populateColumns(head: any) {
    if (head) {
      head.forEach((v:any) => {
        switch(typeof v) {
          case 'object':
            this.columns.push({'name': v.title});
            break;
          default:
            this.columns.push({'name': v});
            break;
        }
      });
    }
  }

  set populateRows(rows: any) {
    let  mappedRow = [];
    rows.map((val) => {
     mappedRow.push({data: val});
    });

    this.rows = mappedRow;
    console.log(this.rows);
  }

  private open() {
    setTimeout(() => {
      this.dialogService.open(this.dialogID);
    }, 200);
  }
}
