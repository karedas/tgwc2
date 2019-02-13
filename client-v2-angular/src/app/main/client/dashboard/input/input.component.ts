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
import { GenericDialogService } from 'src/app/main/common/dialog/dialog.service';

@Component({
  selector: 'tg-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class InputComponent implements AfterViewInit {

  @ViewChild('inputCommand') ic: ElementRef;

  facolumns = faColumns;
  faSolarPanel = faSolarPanel;
  faBullseye = faBullseye;

  extraOutputStatus$: Observable<boolean>;
  dashBoardStatus$: Observable<boolean>;

  zenStatus$: BehaviorSubject<boolean>;


  constructor(
    private game: GameService,
    private store: Store<ClientState>,
    private historyService: HistoryService,
  ) {
    
    this.extraOutputStatus$ = this.store.pipe(select(getUIState), map((state: UIState) => state.extraOutput));
    this.dashBoardStatus$ = this.store.pipe(select(getUIState), map((state: UIState) => state.showDashBoard));

  }

  ngAfterViewInit() {
    this.game._focusInput.subscribe(
      () => {
        console.log('focus input');
        this.focus();
      }
    );
  }

  focus() {
    this.ic.nativeElement.focus();
  }

  onEnter(event: any, val: string) {
    event.target.value = '';
    this.game.processCommands(val, true);
  }

  onUpKey(event: any) {
    event.preventDefault();
    const cmd = this.historyService.getPrevious();
    if (cmd) {
      event.target.value = cmd;
      this.moveCursorAtEnd(event.target);
    }
  }

  onDownKey(event: any) {
    event.preventDefault();
    const cmd = this.historyService.getNext();
    if (cmd) {
      event.target.value = cmd;
      this.moveCursorAtEnd(event.target);
    }
  }

  moveCursorAtEnd(target) {
    if (typeof target.selectionStart === 'number') {
      target.selectionStart = target.selectionEnd = target.value.length;
    } else if (typeof target.createTextRange !== 'undefined') {
      this.focus();
      const range = target.createTextRange();
      range.collapse(false);
      range.selec();
    }
  }

  toggleExtraOutput(event: Event) {
    event.preventDefault();
    this.store.dispatch(new ToggleExtraOutput(null));
  }

  toggleDashboard(event: Event) {
    event.preventDefault();
    this.store.dispatch(new ToggleDashboard());
  }

  toggleZen(event: Event) {
    event.preventDefault();
  }

  @HostListener('window:keydown', ['$event'])
  onLastCommandSend(event: KeyboardEvent) {
    if (event.which === 49 && event.shiftKey === true && this.ic.nativeElement.value === 0) {
      const l = this.historyService.cmd_history.length;

      if (l > 0) {
        this.game.processCommands(this.historyService.cmd_history[l - 1]);
      }
      return false;
    }
  }
}
