import { Component, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { IObjectAndPerson } from 'src/app/main/client/models/data/objpers.model';
import { GameService } from 'src/app/main/client/services/game.service';

@Component({
  selector: 'tg-objpers-detail',
  templateUrl: './objpers-detail.component.html',
  styleUrls: ['./objpers-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjpersDetailComponent {

  @Input() html: IObjectAndPerson;

  constructor(
    private gameService: GameService
  ) {
   }

   onInteract(where?: any) {
    if (where) {
      this.gameService.processCommands(`guarda &${where.num}`, false);
    }
   }
}
