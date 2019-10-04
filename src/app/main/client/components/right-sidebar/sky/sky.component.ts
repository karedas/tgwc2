import { Component} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getSky } from 'src/app/main/client/store/selectors';
import { DataState } from 'src/app/main/client/store/state/data.state';

@Component({
  selector: 'tg-sky',
  templateUrl: './sky.component.html',
  styleUrls: ['./sky.component.scss']
})
export class SkyComponent {
  skyValue: Observable<any>;
  constructor(private store: Store<DataState>) {
    this.skyValue = this.store.pipe(select(getSky));
  }
}
