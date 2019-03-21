import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, OnDestroy, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PreloaderService } from '../common/services/preloader.service';
import { DOCUMENT } from '@angular/common';
import { AnimationBuilder, style, animate, AnimationPlayer } from '@angular/animations';

@Component({
  selector: 'tg-splashscreen',
  templateUrl: './splashscreen.component.html',
  styleUrls: ['./splashscreen.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SplashscreenComponent implements OnInit, OnDestroy {

  @Output() preloadDone: EventEmitter<any> = new EventEmitter<any>();

  splashScreenEl: any;
  player: AnimationPlayer;
  preloadPerc: any;
  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private _animationBuilder: AnimationBuilder,
    private preloader: PreloaderService,
    @Inject(DOCUMENT) private _document: any
    ) {
      this.splashScreenEl = this._document.body.querySelector('#splashscreen');
      this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {

    this.preloader.percentage.pipe(
      takeUntil(this._unsubscribeAll)).subscribe(amount => {
        this.preloadPerc = amount;
      });


    this.preloader.status$
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(status => {
        if (status === true) {
          this.preloadDone.emit(status);
          this.hide();
        }
      });
  }

  show(): void {
    this._animationBuilder
      .build([
        style({
          opacity: '0',
          zIndex: '99999'
        }),
        animate('400ms ease', style({opacity: '1'}))
      ]).create(this.splashScreenEl);

    setTimeout(() => {
      this.player.play();
    }, 0);
  }

  hide(): void {
    this.player = 
      this._animationBuilder
        .build([
          style({ opacity: '1'}),
          animate('400ms ease', style({
            opacity: '0',
            zIndex: '-10'
          }))
        ]).create(this.splashScreenEl);

    
    setTimeout(() => {
      this.player.play();
    }, 0);

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
