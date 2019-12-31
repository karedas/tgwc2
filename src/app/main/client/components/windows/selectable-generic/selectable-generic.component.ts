import { Component, Inject, QueryList, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatSelectionList, MatSelectionListChange, MatDialogRef } from '@angular/material';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'tg-selectable-generic',
  templateUrl: './selectable-generic.component.html',
  styleUrls: ['./selectable-generic.component.scss']
})
export class SelectableGenericComponent {
  @ViewChildren('selectableList') selectableList: QueryList<MatSelectionList>;
  selectedValueText = 'Nessuno';
  adjectiveShowed: string;

  constructor(
    private gameService: GameService,
    public dialog: MatDialogRef<SelectableGenericComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
  }

  onSelectionChange($event: MatSelectionListChange) {

    if ($event.option.selected) {
      this.adjectiveShowed = '';
      this.selectedValueText = $event.option.value.sel;
      this.adjectiveShowed = $event.option.value.show;
    }

    this.selectableList.forEach((selectList: MatSelectionList) => {
      selectList.deselectAll();
    });

    $event.option.selected = true;
  }

  saveAdjective() {
    if (this.data.cmd) {
      const cmd = this.data.cmd;
      this.gameService.sendToServer(cmd + ' ' + this.selectedValueText);
    }

    this.dialog.close();
  }
}
