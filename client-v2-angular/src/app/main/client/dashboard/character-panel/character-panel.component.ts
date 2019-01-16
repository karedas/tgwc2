import { Component } from '@angular/core';
import { DataState } from 'src/app/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { getStatus } from 'src/app/store/selectors';

@Component({
  selector: 'tg-character-panel',
  templateUrl: './character-panel.component.html',
  styleUrls: ['./character-panel.component.scss']
})
export class CharacterPanelComponent {

  status: any;
  inCombat: boolean = false;

  constructor(private store: Store<DataState>) {
    this.store.pipe(select(getStatus)).subscribe(values => {
      this.status = values;
    });
  }

  setStatusBar(key: number): any {
    const styles = {
      'width': this.status[key]
    };
    return styles;
  }
}
