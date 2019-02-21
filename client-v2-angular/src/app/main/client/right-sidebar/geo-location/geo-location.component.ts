import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IRegion } from 'src/app/models/data/region.model';
import { DataState } from 'src/app/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { getRegion } from 'src/app/store/selectors';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';

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
  clanName: string;
  regionName: string;
  icon: number;
  clan_icon: number;
  interaz_color: string;
  idreg: number;

  region$: Observable<IRegion>;

  private _unsubscribeAll: Subject<any>;



  constructor(private store: Store<DataState>) { 
    this.region$ = this.store.pipe(select(getRegion));
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {

    this.region$.pipe(takeUntil(this._unsubscribeAll))
      .subscribe( (region: IRegion) => {
        if (region) {
          this.newRegionfadeInOut(region);
        }
      }
    );
  }

  newRegionfadeInOut(region: IRegion) {

    this.changeState = 'out';

    setTimeout(() => {
      this.regionName = region.name;
      this.clanName = region.clan_name;
      this.icon =  region.icon;
      this.clan_icon = region.clan_icon;
      this.interaz_color = region.type;
      this.idreg = region.idreg;
      this.changeState = 'in';


    }, 1000);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
   }

}
