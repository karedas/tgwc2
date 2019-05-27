import { Component, OnInit, ViewEncapsulation, OnDestroy, Input, OnChanges } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { IRegion } from 'src/app/main/client/models/data/region.model';
import { DataState } from 'src/app/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { getRegion } from 'src/app/store/selectors';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { takeUntil, map, catchError, switchMap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Response } from 'selenium-webdriver/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'tg-geo-location',
  templateUrl: './geo-location.component.html',
  styleUrls: ['./geo-location.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInFadeOut', [
      // ...
      state('in', style({
        opacity: 1,
      })),
      state('out', style({
        opacity: 0,
      })),
      transition('* => out', [
        animate('1s')
      ]),
      transition('* => in', [
        animate('1s')
      ]),
    ]),
  ]

})
export class GeoLocationComponent implements OnInit , OnDestroy {

  public changeState = 'out';
  public regionImageUrl = 'assets/images/regions/base.jpg';
  public region$: Observable<IRegion>;


  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    ) {
    this.region$ = this.store.pipe(select(getRegion));
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {
    this.region$.pipe(takeUntil(this._unsubscribeAll))
      .subscribe( (region: IRegion) => {
        if (region) {
          const image = new Image();
          image.src = 'assets/images/regions/' + region.idreg + '.jpg';
          image.onload = () => {
            this.newRegionfadeInOut(image.src);
          };
        }
      }
    );
  }

  newRegionfadeInOut(imageUrl) {
    this.changeState = 'out';
    setTimeout(() => {
      this.regionImageUrl = imageUrl;
      this.changeState = 'in';
    }, 1000);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
   }
}

