import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { LogService } from 'src/app/services/log.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { saveAs } from 'file-saver';

@Component({
  selector: 'tg-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit, OnDestroy{

  @ViewChild('logContentArea') logContentArea: ElementRef;

  logStorage = [];

  private _unsubscribeAll: Subject<any>;

  constructor(
    private logService: LogService
  ) {
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {
   this.logService.log$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((log: any) => {
      this.logStorage.push(log);
    });
  }

  saveLog() {
    const content =  this.logContentArea.nativeElement.innerHTML;
    //TODO: Move in Config or in another place
    const d = new Date();
    const dateTime = d.getFullYear + '-' + d.getMonth + '-' + d.getHours() + '-' + d.getMinutes() + '-' + d.getMilliseconds()
    const file = new File([content], dateTime + '_TG-LOG.html' , {type: "text/plain;charset=utf-8"});
    saveAs(file);
  }

  resetLog() {

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
