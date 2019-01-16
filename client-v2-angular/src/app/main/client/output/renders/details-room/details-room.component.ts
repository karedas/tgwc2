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

  personsHtStat: Object[] = [];
  objsHtStat: Object[] = [];
  
  constructor(private store: Store<DataState>) { 
    
  }

  ngOnInit(): void {
  }

  getHsStatBgPos(condprc:number) {
    const pos = -13 * Math.floor(12 * (100 - condprc) / 100);
    const styleValue =  `0 ${pos}px`;
    console.log('ok..?')
    return styleValue;
  }

}
