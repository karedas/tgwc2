import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RoomList } from 'src/app/main/client/models/data/room.model';
import { GameService } from 'src/app/main/client/services/game.service';

import { OutputService } from '../../services/output.service';

@Component({
  selector: 'tg-room-persons-list',
  templateUrl: './room-persons-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomPersonsListComponent implements OnInit {
  @Input('persons') persons: RoomList[];

  totalPersons = 0;
  personsClass50_50 = false;
  togglePanel: any = {};

  constructor(
    private outputService: OutputService,
    private gameService: GameService) {}

  ngOnInit() {
    this.getTotalByType();
  }

  private getTotalByType() {
    for (let i = 0; i < this.persons.length; i++) {
      this.togglePanel[i] = false;
    }
    this.getPersosnsContentClass();
  }

  private getPersosnsContentClass() {
    if (this.persons.length >= 6) {
      this.personsClass50_50 = true;
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
