import { Component, OnInit, SimpleChange, ChangeDetectionStrategy, ViewEncapsulation, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { DialogService } from 'src/app/main/common/dialog/trash/dialog.service';
import { select, Store } from '@ngrx/store';
import { getGenericTable } from 'src/app/store/selectors';
import { DataState } from 'src/app/store/state/data.state';
import { IGenericTable } from 'src/app/models/data/generictable.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ModalConfiguration } from 'src/app/main/common/dialog/model/modal.interface';

@Component({
  selector: 'tg-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GenericTableComponent implements  AfterViewInit, OnDestroy {

  @ViewChild('tgdatatable') table: DatatableComponent;
  // @ViewChild('tgDialog') dialog: jqxWindowComponent;
  @ViewChild('windowContent') windowContent: ElementRef;

  public readonly dialogID: string = 'genericTable';

  public dataTable$: Observable<any>;
  public modalConfig: ModalConfiguration = new ModalConfiguration;

  public rows = [];
  public columns = [];
  public currentPageLimit = 15;
  public currentVisible = 3;
  
  contentHeight: number;

  public readonly messages = {
    // Footer total message
    totalMessage: 'Totali'
  };

  // public readonly pageLimitOptions = [
  //   {value: 5},
  //   {value: 10},
  //   {value: 25},
  //   {value: 50},
  //   {value: 100},
  // ];
  // public readonly visibleOptions = [
  //   {value: 1},
  //   {value: 3},
  //   {value: 5},
  //   {value: 10},
  // ];

  public readonly headerHeight = 30;
  public readonly footerHeight = 44;
  public readonly rowHeight = 30;


  constructor(
    private dialogService: DialogService,
    private store: Store<DataState>
  ) {

    this.modalConfig.draggable = true;
    this.modalConfig.isModal = false;
    this.modalConfig.height = 'auto';
    this.modalConfig.width = 740;



    this.dataTable$ = this.store.pipe(select(getGenericTable));
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // this.dataTable$.subscribe(
    //   (dt: IGenericTable) => {
    //     if (dt) {
    //       this.populate(dt);
    //       this.open();
    //     }
    //   });
  }

  // private populate(dataTable: any) {

  //   this.rows = [];
  //   this.columns = [];

  //   if (dataTable.head) {
  //     dataTable.head.forEach((v: any, i: number) => {
  //       switch (typeof v) {
  //         case 'object':
  //           this.columns.push({ prop: 'prop_' + i, 'name': v.title.toLowerCase() });
  //           break;
  //         default:
  //           this.columns.push({ prop: 'prop_' + i, 'name': v.toLowerCase() });
  //           break;
  //       }
  //     });
  //   }
  //   if (dataTable.data) {
  //     dataTable.data.forEach((d: any) => {
  //       const obj = {};
  //       d.map((row: string, rowIndex: number) => {
  //         obj[this.columns[rowIndex].prop] = row;
  //       });
  //       this.rows.push(obj);
  //     });
  //   }
  // }

  // private close() {
  //   this.dialogService.close(this.dialogID);
  // }

  // private open() {
  //   setTimeout(() => {
  //     this.dialogService.open(this.dialogID);
  //     this.dialogService.toFront(this.dialogID);
  //   }, 200);

  // }

  // /**
  //  * Get the content Height based on Header, Body and Footer 
  //  * of ngx-datatable, then return @number value
  //  */
  // setContentHeight() {
  //   let bodyHeight = 0;
  //   if (this.rows.length < this.currentPageLimit) {
  //     bodyHeight = this.rows.length * this.rowHeight;
  //   } else {
  //     bodyHeight = this.currentPageLimit * this.rowHeight;
  //   }
  //   this.contentHeight = this.footerHeight + this.headerHeight + bodyHeight;
  // }
  
  
  ngOnDestroy(): void {
   
  }
}

