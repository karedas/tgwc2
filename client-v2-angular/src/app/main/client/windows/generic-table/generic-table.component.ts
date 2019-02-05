import { Component, ViewEncapsulation, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getGenericTable } from 'src/app/store/selectors';
import { DataState } from 'src/app/store/state/data.state';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { IGenericTable } from 'src/app/models/data/generictable.model';
import { DialogService } from 'src/app/main/common/dialog/dialog.service';
import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'tg-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GenericTableComponent implements  AfterViewInit, OnDestroy {

  @ViewChild('tgdatatable') table: DatatableComponent;

  public readonly dialogID: string = 'genericTable';
  public dataTable$: Observable<any>;
  public rows = [];
  public columns = [];
  public currentPageLimit = 15;
  public currentVisible = 3;

  public readonly messages = {
    totalMessage: 'Totali'
  };
  
  public readonly headerHeight = 30;
  public readonly footerHeight = 44;
  public readonly rowHeight = 30;
  
  contentHeight: number;

  constructor(
    private store: Store<DataState>,
    private dialogService: DialogService
  ) {

    this.dataTable$ = this.store.pipe(select(getGenericTable));
  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    this.dataTable$.subscribe(
      (dt: IGenericTable) => {
        if (dt) {
          this.populate(dt);
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

  private close() {
    this.dialogService.close(this.dialogID);
  }

  private open() {
    setTimeout(() => {
      this.dialogService.open(this.dialogID, {
        draggable: true,
        modal: false,
        width: 'auto',
        height: 'auto',
        resizable: true,
        maximizable: true,
        header: 'Informazioni'
      });
    }, 200);

  }

  // /**
  //  * Get the content Height based on Header, Body and Footer
  //  * of ngx-datatable, then return @number value
  //  */

  setContentHeight() {
    let bodyHeight = 0;
    if (this.rows.length < this.currentPageLimit) {
      bodyHeight = this.rows.length * this.rowHeight;
    } else {
      bodyHeight = this.currentPageLimit * this.rowHeight;
    }
    this.contentHeight = this.footerHeight + this.headerHeight + bodyHeight;
  }
  ngOnDestroy(): void {
  }
}

