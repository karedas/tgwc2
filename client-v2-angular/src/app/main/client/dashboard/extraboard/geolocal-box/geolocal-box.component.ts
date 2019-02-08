import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IRegion } from 'src/app/models/data/region.model';
import { DataState } from 'src/app/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { getRegion } from 'src/app/store/selectors';
import { trigger, style, state, transition, animate, query, stagger } from '@angular/animations';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'tg-geolocal-box',
  templateUrl: './geolocal-box.component.html',
  styleUrls: ['./geolocal-box.component.scss'],
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


export class GeolocalBoxComponent implements OnInit {

  changeState: string = '';

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
  }

  ngOnInit() {

    this.region$.pipe().subscribe(
      (region: IRegion) => {
        if(region) {
          this.newRegionfadeInOut(region);
        }
      }
    )
  }

  newRegionfadeInOut(region: IRegion){
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

}
