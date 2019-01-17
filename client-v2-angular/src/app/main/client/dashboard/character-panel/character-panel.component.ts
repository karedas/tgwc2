import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataState } from 'src/app/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { getStatus, getHero } from 'src/app/store/selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'tg-character-panel',
  templateUrl: './character-panel.component.html',
  styleUrls: ['./character-panel.component.scss']
})
export class CharacterPanelComponent implements OnInit, OnDestroy{

  status: any[] = [0,0,0,0];
  inCombat: boolean = false;


  heroName: string;
  heroAdjective: string;
  heroImage: string;

  enemyHealt: number = 0;
  enemyMove: number = 0;
  enemyName: string = '';
  enemyIcon: number = null;

  private _unsubscribeAll: Subject<any>;
  
  constructor(private store: Store<DataState>) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this.store.pipe(
      select(getHero), 
      takeUntil(this._unsubscribeAll)).subscribe(
        hero => { 
          this.setStatus(hero.status);
          this.heroName = hero.name;
          this.heroAdjective = hero.adjective;
          this.heroImage = environment.media_address + hero.image;
        }
      );
  }

  private setStatus(status: any[]) {
    if(status != undefined) {
      this.status = status;
      this.setCombatPanel();
    }
  }

  setCombatPanel() {

    console.log(this.status);
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
