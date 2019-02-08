import { Component, Input, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { RoomList } from 'src/app/models/data/room.model';

import { equip_positions_by_name } from 'src/app/main/common/constants';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tg-details-room',
  templateUrl: './details-room.component.html',
  styleUrls: ['./details-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DetailsRoomComponent implements OnInit {

  @Input('objs') objs: RoomList[];
  @Input('persons') persons: RoomList[];

  totalObjs = 0;
  totalPersons = 0;
  total: number;

  objsClass50 = false;
  objsClass50_50 = false;
  personsClass50 = false;
  personsClass50_50 = false;

  togglePanel: any = {};


  constructor(private store: Store<DataState>, private game: GameService) {
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

    for (let i = 0; i < total; i++) {
      this.togglePanel[i] = false;
    }

    this.getObjsContentClass();
    this.getPersosnsContentClass();
  }

  private getObjsContentClass() {
    if (this.totalObjs >= 6 && this.totalPersons <= 6) {
      this.objsClass50_50 = true;
    } else if (this.totalObjs >= 6 && this.totalPersons >= 6) {
      this.objsClass50 = true;
    }
  }

  private getPersosnsContentClass() {
    if (this.totalPersons >= 6 && this.totalObjs <= 6) {
      this.personsClass50_50 = true;
    } else if (this.totalPersons >= 6 && this.totalObjs >= 6) {
      this.personsClass50 = true;
    }
  }

  public getHstat(condprc: number): string {
    return this.game.getHsStatBgPos(condprc);
  }

  /**
  * Expand or send Command to Server after click
  * based on content type, list or single obj / person
   */

  onInteract(event: Event, item: any, index: number, list?: boolean) {
    event.preventDefault();
    if (!item.sz) {
      if (!item.cntnum) {
        this.game.processCommands(`guarda &${item.mrn[0]}`);
      } else if (item.cntnum && item.mrn.length > 0) {
        this.game.processCommands(`guarda &${item.mrn[0]} &${item.cntnum}`);
      }
    } else if (list) {
      const mrn = item.mrn.length ? item.mrn[0] : item.mrn;
      this.game.processCommands(`guarda &${mrn}`);
    }
  }

  onExpand(event: Event, item: any, index: number) {
    event.preventDefault();
    //  Is Expandable
    if (item.sz) {
      this.togglePanel[index] = !this.togglePanel[index];
    }
  }
}
