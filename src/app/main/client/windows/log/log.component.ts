import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { LogService } from 'src/app/services/log.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { saveAs } from 'file-saver';

@Component({
  selector: 'tg-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
})
export class LogComponent implements OnInit, OnDestroy{

  @ViewChild('logContentArea') logContentArea: ElementRef;

  logStorage = [];
  dateTime: string;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private logService: LogService
  ) {
    this._unsubscribeAll = new Subject<any>();
    const d = new Date();
    this.dateTime = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}, ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
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
    const file = new File([content], this.dateTime.replace(/\-|:/g, '_') + '_TG-LOG.html' , {type: "text/plain;charset=utf-8"});
    saveAs(file);
  }

  resetLog() {

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
