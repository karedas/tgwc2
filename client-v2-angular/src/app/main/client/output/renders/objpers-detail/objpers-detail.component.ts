import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { IObjPersDesc } from 'src/app/models/data/objpers.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tg-objpers-detail',
  templateUrl: './objpers-detail.component.html',
  styleUrls: ['./objpers-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjpersDetailComponent implements OnInit {

  @Input() html: IObjPersDesc;

  constructor(private game: GameService) { }

  ngOnInit() {
  }
}
