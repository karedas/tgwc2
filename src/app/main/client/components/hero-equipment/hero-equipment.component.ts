import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { DataState } from '../../store/state/data.state';
import { GameService } from '../../services/game.service';
import { getEquip } from '../../store/selectors';
import { takeUntil } from 'rxjs/operators';
import { equipPositionByName } from '../../common/constants';

@Component({
  selector: 'tg-hero-equipment',
  templateUrl: './hero-equipment.component.html',
  styleUrls: ['./hero-equipment.component.scss']
})
export class HeroEquipmentComponent implements OnInit, OnDestroy {

  equipment: any[] = [];
  equipPositionValue: {};

  private _equipment$: Observable<any>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private gameService: GameService,
  ) { 
    this.equipPositionValue = Object.entries(equipPositionByName);
    this._equipment$ = this.store.pipe(select(getEquip));
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this._equipment$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(equipment => {
      if (equipment !== undefined) {
        this.equipment = this.gameService.orderObjectsList(equipment);
      }
    });
  }

  interactElement(item, mine?: boolean) {
    this.gameService.interact(item, null, mine);
  }
  
  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
