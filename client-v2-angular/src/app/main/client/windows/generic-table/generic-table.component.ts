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

  rows = {};


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
        console.log(dt);
        if(dt) {
          this.rows = dt.data
          this.open();
        }
      }
    );
  }

  private open() {
    setTimeout(() => {
      this.dialogService.open(this.dialogID);
    }, 200);
  }

  ngOnChanges(changes: SimpleChange): void {
    console.log(changes);    
  }

}
