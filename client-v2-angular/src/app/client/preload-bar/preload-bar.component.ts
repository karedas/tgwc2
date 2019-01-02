import { Component, OnInit, OnDestroy } from '@angular/core';
import { PreloadBarService } from './preload-bar.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'tg-preload-bar',
  templateUrl: './preload-bar.component.html',
  styleUrls: ['./preload-bar.component.scss']
})
export class PreloadBarComponent implements OnInit, OnDestroy {

  bufferValue: number;
  mode: 'determinate' | 'indeterminate';
  value: number;
  visible: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private progressBarService: PreloadBarService
  ) {
    this._unsubscribeAll = new Subject();
   }


   
  ngOnInit(): void {
    // this.progressBarService.bufferValue
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((bufferValue) => {
    //     this.bufferValue = bufferValue;
    //   })

    this.progressBarService.mode
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((mode) => {
        this.mode = mode;
      })

    this.progressBarService.value
      .pipe(takeUntil(this._unsubscribeAll)) 
      .subscribe(value => {
        this.value = value;
      });

    this.progressBarService.visible
      .pipe(takeUntil(this._unsubscribeAll)) 
      .subscribe(visible => {
        this.visible = visible;
      });
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
