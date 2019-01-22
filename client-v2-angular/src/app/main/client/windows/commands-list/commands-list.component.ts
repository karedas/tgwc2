import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tg-commands-list',
  templateUrl: './commands-list.component.html',
  styleUrls: ['./commands-list.component.scss']
})
export class CommandsListComponent implements OnInit {

  private cols: number = 6;
  commands$: Observable<any>;
  title: string;

  constructor(private game: GameService) {
   this.commands$ =  this.game.getCommands();
   }

  ngOnInit() {
  }

}
