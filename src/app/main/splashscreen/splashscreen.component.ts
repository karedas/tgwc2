import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, OnDestroy, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { AnimationBuilder, style, animate, AnimationPlayer } from '@angular/animations';
import { SplashScreenService } from './splashscreen.service';

@Component({
  selector: 'tg-splashscreen',
  templateUrl: './splashscreen.component.html',
  styleUrls: ['./splashscreen.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SplashscreenComponent implements OnInit, OnDestroy {

  @Output() loaded: EventEmitter<any> = new EventEmitter<any>();

  splashScreenEl: any;
  player: AnimationPlayer;
  preloadPerc: any;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _animationBuilder: AnimationBuilder,
    private splashScreenService: SplashScreenService,
    @Inject(DOCUMENT) private _document: any
    ) {
      this.splashScreenEl = this._document.body.querySelector('#splashscreen');
      this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {

    this.splashScreenService.percentage.pipe(
      takeUntil(this._unsubscribeAll)).subscribe(amount => {
        this.preloadPerc = amount;
      });


    this.splashScreenService.status$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(status => {
        if (status === true) {
          this.hide();
          setTimeout(() => {
            this.loaded.emit(true);
          }, 450);
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
