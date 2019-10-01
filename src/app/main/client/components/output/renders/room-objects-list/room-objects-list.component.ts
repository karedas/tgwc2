import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { RoomList } from 'src/app/main/client/models/data/room.model';
import { GameService } from 'src/app/main/client/services/game.service';
import { OutputService } from '../../services/output.service';

@Component({
  selector: 'tg-room-objects-list',
  templateUrl: './room-objects-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomObjectsListComponent implements OnInit {
  @Input('objects') objects: RoomList[];

  totalObjs = 0;
  objsClass50_50 = false;
  togglePanel: any = {};

  constructor( 
    private outputService: OutputService, 
    private gameService: GameService) {}

  ngOnInit() {
    this.getTotalByType();
  }

  private getTotalByType() {
    for (let i = 0; i < this.objects.length; i++) {
      this.togglePanel[i] = false;
    }
    this.getObjsContentClass();
  }

  private getObjsContentClass() {
    if (this.objects.length >= 6) {
      this.objsClass50_50 = true;
    }
  }

  onInteract(item: any, index?: number) {
    this.gameService.interact(item, index);
  }

  onExpand(event: Event, item: any, index: number) {
    if (this.outputService.isExpandeable(event, item, index)) {
      this.togglePanel[index] = !this.togglePanel[index];
    }
  }
}
