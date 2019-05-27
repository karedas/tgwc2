import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { IObjPersDesc } from 'src/app/main/client/models/data/objpers.model';
import { GameService } from 'src/app/main/client/services/game.service';

@Component({
  selector: 'tg-objpers-detail',
  templateUrl: './objpers-detail.component.html',
  styleUrls: ['./objpers-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjpersDetailComponent {

  @Input() html: IObjPersDesc;

  constructor() { }
}
