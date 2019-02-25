import { Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { RoomList } from 'src/app/models/data/room.model';
import { InteractService } from '../../services/interact.service';

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


  constructor(public interactService: InteractService) {
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

  onInteract(event: Event, item: any, index: number, list?: boolean) {
    this.interactService.interact(event, item, index, list);
  }

  onExpand(event: Event, item: any, index: number) {
    if (this.interactService.isExpandeable(event, item, index)) {
      this.togglePanel[index] = !this.togglePanel[index];
    }
  }
}
