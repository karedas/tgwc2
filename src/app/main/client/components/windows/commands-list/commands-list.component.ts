import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { NgScrollbar } from 'ngx-scrollbar';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'tg-commands-list',
  templateUrl: './commands-list.component.html',
  styleUrls: ['./commands-list.component.scss'],

})
export class CommandsListComponent implements OnInit {
  @Input('data') data: any;
  @ViewChild(NgScrollbar, {static: true}) scrollbar: NgScrollbar;


  commands$: Observable<any>;
  title: string;
  groupOpen = 0;

  constructor(private game: GameService) {
  }

  ngOnInit() {
    this.commands$ =  this.game.getCommands();
  }

  removeTitleObject(commands) {
    delete commands.title;
    return commands;
  }

  setOpenedGroup(index: number) {
    this.groupOpen = index;
    setTimeout(() => {
      this.scrollbar.update();
    }, 200);
  }

  sendCmd(cmd) {
    this.game.processCommands(cmd);
  }
}
