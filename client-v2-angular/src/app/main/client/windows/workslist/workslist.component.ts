import { Component, OnDestroy, AfterViewInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { DialogService } from 'src/app/main/common/dialog/dialog.service';
import { getWorksList } from 'src/app/store/selectors';
import { takeUntil } from 'rxjs/operators';
import { IWorks, IWorksList } from 'src/app/models/data/workslist.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tg-workslist',
  templateUrl: './workslist.component.html',
  styleUrls: ['./workslist.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkslistComponent implements AfterViewInit, OnDestroy {

  public readonly dialogID = 'workslist';

  
  public readonly cols: any = [
    {field: 'id', header: '#'},
    {field: 'icon', header: ''},
    {field: 'diff', header: 'Difficolt&agrave;'},
    {field: 'cando', header: 'Puoi?'},
    {field: 'desc', header: 'Descrizione'},
    {field: 'action', header: ''},
  ];
  
  public rows = [];
  public currentPageLimit = 15;
  private cmd: string;

  
  public dataTable$: Observable<any>;
  private _unsubscribeAll: Subject<any>;


  constructor(
    private store: Store<DataState>, 
    private game: GameService,
    private dialogService: DialogService
    ) {

      this.dataTable$ = this.store.pipe(select(getWorksList));
      this._unsubscribeAll = new Subject;
     }
  
  ngAfterViewInit(): void {

    this.dataTable$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (wl: IWorks) => {
        if(wl) {
          this.cmd = wl.cmd;
          this.populate(wl.list);
          this.open(wl.verb);
        }
      }
    );
  }

  private populate(wl) {
    if(wl) {
      wl.forEach((dataRow: IWorksList) => {
        this.rows.push(dataRow);
      });
    }
  }

  private open(title) {
    setTimeout(() => {
      console.log('apre?');
      this.dialogService.open(this.dialogID, {
        draggable: true,
        modal: false,
        width: 'auto',
        height: 'auto',
        header: `Cosa sai ${title}`
      }, 200);  
    });
  }


  onAction(index: number, event: Event){
    event.preventDefault();
    if(this.cmd) {
      this.game.processCommands(this.cmd + ' ' + (index + 1));
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
