import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NgScrollbar } from 'ngx-scrollbar';
import { GameService } from '../../../services/game.service';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'tg-commands-list',
  templateUrl: './commands-list.component.html',
  styleUrls: ['./commands-list.component.scss'],

})
export class CommandsListComponent implements OnInit {
  // @Input('data') data: any;
  @ViewChild(NgScrollbar, {static: true}) scrollbar: NgScrollbar;


  commandsList: any;
  title: string;
  groupOpen = 0;

  constructor(
    private game: GameService, 
    @Inject(MAT_DIALOG_DATA) public data) {
    }
    
    ngOnInit() {
      this.commandsList = this.data.cmds;
  }

  removeTitleObject(cmds)  {
    delete cmds.title;
    return cmds;
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
