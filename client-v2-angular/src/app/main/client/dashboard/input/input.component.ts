import { Component, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation, HostListener } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

import { faColumns, faSolarPanel, faBullseye } from '@fortawesome/free-solid-svg-icons';

import { Store, select } from '@ngrx/store';
import { ClientState } from 'src/app/store/state/client.state';
import { ToggleExtraOutput, ToggleDashboard } from 'src/app/store/actions/ui.action';
import { HistoryService } from 'src/app/services/history.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { getUIState } from 'src/app/store/selectors';
import { map } from 'rxjs/operators';
import { UIState } from 'src/app/store/state/ui.state';
import { DialogService } from 'src/app/main/common/dialog/dialog.service';

@Component({
  selector: 'tg-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class InputComponent implements AfterViewInit {

  facolumns = faColumns;
  faSolarPanel = faSolarPanel;
  faBullseye = faBullseye;

  extraOutputStatus$: Observable<boolean>;
  dashBoardStatus$: Observable<boolean>;

  zenStatus$: BehaviorSubject<boolean>;

  @ViewChild('inputCommand') ic: ElementRef;

  constructor(
    private game: GameService,
    private store: Store<ClientState>,
    private historyService: HistoryService,
    private dialogService: DialogService,
  ) {
    this.extraOutputStatus$ = this.store.pipe(select(getUIState), map((state: UIState) => state.extraOutput));
    this.dashBoardStatus$ = this.store.pipe(select(getUIState), map((state: UIState) => state.showDashBoard));
  }

  ngAfterViewInit() {
    this.focus();
  }

  focus() {
    this.ic.nativeElement.focus();
  }

  onEnter(event: any, val: string) {
    event.target.value = '';
    this.game.processCommands(val, true);
  }

  onUpKey(event: any) {
    const cmd = this.historyService.getPrevious();
    if (cmd) {
      event.target.value = cmd;
    }
  }

  onDownKey(event: any) {
    const cmd = this.historyService.getNext();
    if (cmd) {
      event.target.value = cmd;
    }
  }

  toggleExtraOutput(event: Event) {
    event.preventDefault();
    this.store.dispatch(new ToggleExtraOutput());
  }

  toggleDashboard(event: Event) {
    event.preventDefault();
    this.store.dispatch(new ToggleDashboard());
  }

  toggleZen(event: Event) {
    event.preventDefault();
    // this.store.dispatch(new updateUI({zen: true}));
    // this.dialogService.openNoFeature();
  }

  @HostListener('window:keydown', ['$event'])
  onLastCommandSend(event: KeyboardEvent) {
    if (event.which == 49 && event.shiftKey === true && this.ic.nativeElement.value == 0) {
      const l = this.historyService.cmd_history.length;

      if (l > 0) {
        this.game.processCommands(this.historyService.cmd_history[l - 1]);
      }
      return false;
    }
  }
}
