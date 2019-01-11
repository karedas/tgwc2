import { Component, Renderer2 } from '@angular/core';
import { DataState } from 'src/app/store/state/data.state';
import { getSky } from 'src/app/store/selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tg-sky',
  templateUrl: './sky.component.html',
  styleUrls: ['./sky.component.scss']
})
export class SkyComponent {

  skyValue: string;

  constructor( private store: Store<DataState>) {
    this.store.select(getSky).subscribe(
      sky => {this.skyValue = sky; }
    );
   }
}
