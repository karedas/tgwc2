import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IRegion } from 'src/app/models/data/region.model';
import { DataState } from 'src/app/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { getRegion } from 'src/app/store/selectors';
import { trigger, style, state, transition, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'tg-geolocal-box',
  templateUrl: './geolocal-box.component.html',
  styleUrls: ['./geolocal-box.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0}),
        animate(600 )
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(600, style({opacity: 0})))
    ])
  ]
})


export class GeolocalBoxComponent implements OnInit {

  test: number = 1;

  animationChange: string = 'state1';

  region$: Observable<IRegion>;
  private _unsubscribeAll: Subject<any>;

  constructor(private store: Store<DataState>) {

    this.region$ = this.store.pipe(select(getRegion));
  }

  ngOnInit() {
    setTimeout(() => {
      this.test = 5;
    }, 3000);
  }

}
