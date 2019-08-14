import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, OnDestroy, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { AnimationBuilder, style, animate, AnimationPlayer } from '@angular/animations';
import { SplashScreenService } from './splashscreen.service';

@Component({
  selector: 'tg-splashscreen',
  templateUrl: './splashscreen.component.html',
  styleUrls: ['./splashscreen.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SplashscreenComponent implements AfterViewInit, OnDestroy {

  // @ViewChild('splashscreen', {static: false}) elementRef: ElementRef;
  @Output() loaded: EventEmitter<any> = new EventEmitter<any>(false);

  enabled: boolean = true;
  player: AnimationPlayer;
  preloadPerc: any;



  private _unsubscribeAll: Subject<any>;

  constructor(
    private _animationBuilder: AnimationBuilder,
    private splashScreenService: SplashScreenService,
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private _document: any
    ) {
      this._unsubscribeAll = new Subject<any>();
  }

  ngAfterViewInit(): void {


    this.splashScreenService.percentage
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(amount => {
        // this.show();
        this.preloadPerc = Math.round(amount);
      });


    this.splashScreenService.status$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(status => {
        if (status === true) {
          this.hide();
        }
      });
  }
  

  // show(): void {
  //   let player: AnimationPlayer;
  //   let animationFactory = this._animationBuilder
  //     .build([
  //       style({
  //         zIndex: '999'
  //       }),
  //     ])
      
  //   player = animationFactory.create(this.elementRef.nativeElement);
  //   player.play();
  // }
  

  hide(): void {
    let player: AnimationPlayer;
    let animationFactory  = 
      this._animationBuilder
        .build([
          style({ zIndex: '0'}),
          animate('500ms ease', style({
            opacity: 0,
          })),
        ])

    player = animationFactory.create(this.elementRef.nativeElement);
    player.play();

    player.onDone(() => {
      this.loaded.emit(true);
    });

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
