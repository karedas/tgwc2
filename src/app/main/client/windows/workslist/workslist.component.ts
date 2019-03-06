import { Component, OnDestroy, AfterViewInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { getWorksList } from 'src/app/store/selectors';
import { takeUntil } from 'rxjs/operators';
import { IWorks, IWorksList } from 'src/app/models/data/workslist.model';
import { GameService } from 'src/app/services/game.service';
import { WindowsService } from '../windows.service';
import { Table } from 'primeng/table';


@Component({
  selector: 'tg-workslist',
  templateUrl: './workslist.component.html',
  styleUrls: ['./workslist.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WorkslistComponent implements AfterViewInit, OnDestroy {

  @ViewChild('worksTable') table: Table;

  public readonly dialogID = 'workslist';
  
  public readonly cols: any = [
    {field: 'id', header: '#'},
    {field: 'icon', header: ''},
    {field: 'diff', header: 'Difficoltà'},
    {field: 'cando', header: 'Puoi?'},
    {field: 'desc', header: 'Descrizione'},
    {field: 'action', header: ''},
  ];

  public rows = [];
  public currentPageLimit = 10;
  private cmd: string;
  

  public dataTable$: Observable<any>;
  private _unsubscribeAll: Subject<any>;


  constructor(
    private store: Store<DataState>,
    private game: GameService,
    private windowsService: WindowsService
    ) {

      this.dataTable$ = this.store.pipe(select(getWorksList));
      this._unsubscribeAll = new Subject;
     }

  ngAfterViewInit(): void {
    this.dataTable$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (wl: IWorks) => {
        if (wl) {
          this.cmd = wl.cmd;
          if(this.table ) {
            this.table.reset();
          }
          this.populate(wl.list);
          this.open(wl.verb);
        }
      }
    );
  }

  private populate(wl: any) {

    this.rows = [];

    if (wl) {
      wl.forEach((dataRow: IWorksList) => {
        this.rows.push(dataRow);
      });
    }
  }

  private open(verb) {
    const title = `Cosa sai ${verb}`;
    setTimeout(() => {
      this.windowsService.openDialogTable(this.dialogID, title);
    });
  }


  onAction(index: number, event: Event) {
    event.preventDefault();
    if (this.cmd) {
      this.game.processCommands(this.cmd + ' ' + (index + 1));
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
