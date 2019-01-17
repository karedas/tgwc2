import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { RoomList } from 'src/app/models/data/room.model';

@Component({
  selector: 'tg-details-room',
  templateUrl: './details-room.component.html',
})


export class DetailsRoomComponent implements OnInit{

  @Input('objs') objs: RoomList[];
  @Input('persons') persons: RoomList[];

  totalObjs: number = 0;
  totalPersons: number = 0;
  total: number;

  personsHtStat: Object[] = [];
  objsHtStat: Object[] = [];
  personsClass: string = '';
  objsClass: string = '';
  
  constructor(private store: Store<DataState>) { 
  }

  ngOnInit(): void {
    this.getTotalByType();
  }

  private getTotalByType() {

    if(this.objs) {
      this.totalObjs = this.objs.reduce((prev, cur) => {
        return prev + (!isNaN(cur.sz) ? cur.sz : 0);
      }, 0 );
    }
    if(this.persons) {
      this.totalPersons = this.persons.reduce((prev, cur) => {
        return prev + (!isNaN(cur.sz) ? cur.sz : 0);
      }, 0 );
    }

    this.total = this.totalObjs + this.totalPersons;
    console.log("LOG:", this.totalPersons, this.totalObjs);
  }

  getHsStatBgPos(condprc:number) {
    const pos = -13 * Math.floor(12 * (100 - condprc) / 100);
    const styleValue =  `0 ${pos}px`;
    return styleValue;
  }

}
