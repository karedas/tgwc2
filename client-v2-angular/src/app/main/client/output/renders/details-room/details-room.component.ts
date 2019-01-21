import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { RoomList } from 'src/app/models/data/room.model';

@Component({
  selector: 'tg-details-room',
  templateUrl: './details-room.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class DetailsRoomComponent implements OnInit {

  @Input('objs') objs: RoomList[];
  @Input('persons') persons: RoomList[];

  totalObjs: number = 0;
  totalPersons: number = 0;
  total: number;

  objsClass50: boolean = false;
  objsClass50_50: boolean = false;
  personsClass50: boolean = false;
  personsClass50_50: boolean = false;

  togglePanel: any = {};


  constructor(private store: Store<DataState>) {
  }

  ngOnInit(): void {
    this.getTotalByType();
  }

  private getTotalByType() {

    if (this.objs) {
      this.totalObjs = this.objs.length;
    }
    if (this.persons) {
      this.totalPersons = this.persons.length;
    }

    const total = this.totalObjs + this.totalPersons;

    for(let i = 0; i < total; i++) {
      this.togglePanel[i] = false;
    }

    this.setContentClass();
  }

  getHsStatBgPos(condprc: number): string{
    const pos = -13 * Math.floor(12 * (100 - condprc) / 100);
    const styleValue = `0 ${pos}px`;
    return styleValue;
  }

  private setContentClass() {
    this.getObjsContentClass();
    this.getPersosnsContentClass();
  }


  private getObjsContentClass() {
    if(this.totalObjs >= 6 && this.totalPersons <= 6) {
      this.objsClass50_50 = true;
    }
    else if(this.totalObjs >= 6 && this.totalPersons >= 6) {
      this.objsClass50 = true;
    }
  }

  private getPersosnsContentClass() {
    if(this.totalPersons >= 6 && this.totalObjs <= 6) {
      this.personsClass50_50 = true;
    }
    else if(this.totalPersons >= 6 && this.totalObjs >= 6) {
      this.personsClass50 = true;
    }
  }
}
