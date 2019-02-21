import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IRegion } from 'src/app/models/data/region.model';
import { DataState } from 'src/app/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { getRegion } from 'src/app/store/selectors';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'tg-geo-location',
  templateUrl: './geo-location.component.html',
  styleUrls: ['./geo-location.component.scss'],
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
export class GeoLocationComponent implements OnInit, OnDestroy {
  
  changeState = '';
  region$: Observable<IRegion>;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private http: HttpClient
    ) { 
    this.region$ = this.store.pipe(select(getRegion));
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {
    this.region$.pipe(takeUntil(this._unsubscribeAll))
      .subscribe( (region: IRegion) => {
        if (region) {
          this.loadRegionImage('assets/images/regions_default.jpg');
          this.newRegionfadeInOut();
        }
      }
    );
  }

  showRegionImage(img) {
    this.loadRegionImage(img).subscribe(
      () => { 
        console.log('hide spinner'); /*hide spinner*/
      }
    )
  }

  loadRegionImage(img): Observable<Blob>{
    return this.http.get(img, {responseType: 'blob'})
  }

  newRegionfadeInOut() {
    this.changeState = 'out';
    setTimeout(() => {
      this.changeState = 'in';
    }, 1000);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
   }
}

