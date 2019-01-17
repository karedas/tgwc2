import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataState } from 'src/app/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { getStatus } from 'src/app/store/selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tg-character-panel',
  templateUrl: './character-panel.component.html',
  styleUrls: ['./character-panel.component.scss']
})
export class CharacterPanelComponent implements OnInit, OnDestroy{

  status: any[];
  inCombat: boolean = false;

  enemyHealt: number = 0;
  enemyMove: number = 0;
  enemyName: string = '';
  enemyIcon: number = 416;

  private _unsubscribeAll: Subject<any>;
  
  constructor(private store: Store<DataState>) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this.store.pipe(
      select(getStatus), 
      takeUntil(this._unsubscribeAll)).subscribe(
        values => { this.setStatus(values)}
      );
  }

  private setStatus(status) {
    this.status = status;
    this.setCombatPanel();
  }

  setCombatPanel() {
    if (this.status.length > 4) {

      this.inCombat = true;
      this.updateEnemyIcon();

      this.enemyHealt = this.status[4];
      this.enemyMove = this.status[5];
      this.enemyIcon = this.status[6];
      this.enemyName = this.status[7]; 
    }
    else {
      this.inCombat = false;
      this.enemyHealt = 0;
      this.enemyMove = 0;
      this.enemyName = '';
    }
  }

  private updateEnemyIcon(){}

  ngOnDestroy() {
    console.log('on destroy');
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
