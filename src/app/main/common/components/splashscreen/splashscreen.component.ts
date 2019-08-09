import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, OnDestroy, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { AnimationBuilder, style, animate, AnimationPlayer } from '@angular/animations';
import { SplashScreenService } from './splashscreen.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'tg-splashscreen',
  templateUrl: './splashscreen.component.html',
  styleUrls: ['./splashscreen.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SplashscreenComponent implements OnInit, OnDestroy {

  @Output() loaded: EventEmitter<any> = new EventEmitter<any>(false);

  enabled: boolean = true;
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
    this.splashScreenService.percentage
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(amount => {
        if (amount === 0) {
          this.show();
        }
        this.preloadPerc = Math.round(amount);
      });


    this.splashScreenService.status$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(status => {
        if (status === true) {
          this.hide();
          this.preloadPerc = 0;
          setTimeout(() => {
            this.loaded.emit(true);
          }, 450);
        }
      });
  }

  show(): void {
    this.player = this._animationBuilder
      .build([
        style({
          opacity: '1',
          zIndex: '99999'
        }),
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
          animate('100ms ease', style({
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
