import { Component, OnInit, ChangeDetectionStrategy, HostListener, ViewChild, Input, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { ModalConfiguration } from 'src/app/models/client/modal.interface';
import { NgScrollbar } from 'ngx-scrollbar';
import { DialogService } from 'src/app/main/common/dialog/dialog.service';

@Component({
  selector: 'tg-commands-list',
  templateUrl: './commands-list.component.html',
  styleUrls: ['./commands-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class CommandsListComponent implements OnInit {

  @ViewChild(NgScrollbar) scrollbar: NgScrollbar;

  commands$: Observable<any>;
  modalConfig: ModalConfiguration = new ModalConfiguration;
  title: string;

  groupOpen = 0;

  constructor(private game: GameService, private dialogService: DialogService) {
    this.modalConfig.draggable = true;
    this.modalConfig.isModal = false;
    this.modalConfig.width = 750;
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
}
