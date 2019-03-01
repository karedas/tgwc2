import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { PreloaderService } from '../../common/services/preloader.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tg-splashscreen',
  templateUrl: './splashscreen.component.html',
  styleUrls: ['./splashscreen.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SplashscreenComponent implements OnInit, OnDestroy {

  @Output() preloadDone: EventEmitter<any> = new EventEmitter<any>();
  preloadPerc: any;

  private _unsubscribeAll: Subject<any>;

  // @Input('preloadPerc') preloadPerc: number;

  constructor(
    private preloader: PreloaderService
  ) {
    this._unsubscribeAll = new Subject<any>();
  }


  ngOnInit() {

    this.preloader.percentage.pipe(
      takeUntil(this._unsubscribeAll)).subscribe(amount => {
        this.preloadPerc = amount;
      });


    this.preloader.status$
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(status => {
        if (status == true) {
          this.preloadDone.emit(status);
          // this.gameIsReady();
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
