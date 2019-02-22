import { Component, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation, HostListener, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

import { faColumns, faSolarPanel, faBullseye } from '@fortawesome/free-solid-svg-icons';

import { Store, select } from '@ngrx/store';
import { ClientState } from 'src/app/store/state/client.state';
import { ToggleExtraOutput, ToggleDashboard } from 'src/app/store/actions/ui.action';
import { HistoryService } from 'src/app/services/history.service';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { getUIState, getHeroInCombat } from 'src/app/store/selectors';
import { map, takeUntil } from 'rxjs/operators';
import { UIState } from 'src/app/store/state/ui.state';
import { InputService } from './input.service';

@Component({
  selector: 'tg-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class InputComponent implements AfterViewInit, OnDestroy {

  @ViewChild('inputCommand') ic: ElementRef;

  facolumns = faColumns;
  faSolarPanel = faSolarPanel;
  faBullseye = faBullseye;

  extraOutputStatus$: Observable<boolean>;
  dashBoardStatus$: Observable<boolean>;

  
  zenStatus$: BehaviorSubject<boolean>;
  
  private _inCombat$: Observable<any>;
  inCombat: boolean = false;


  private _unsubscribeAll: Subject<any>;

  constructor(
    private game: GameService,
    private store: Store<ClientState>,
    private historyService: HistoryService,
    private inputService: InputService
  ) {

    this.extraOutputStatus$ = this.store.pipe(select(getUIState), map((state: UIState) => state.extraOutput));
    this.dashBoardStatus$ = this.store.pipe(select(getUIState), map((state: UIState) => state.showDashBoard));
    this._inCombat$ = this.store.pipe(select(getHeroInCombat));

    this._unsubscribeAll = new Subject();
  }

  ngAfterViewInit() {

    this._inCombat$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (cc) => { 
        if(cc && typeof cc.hit !== 'undefined') {
          this.inCombat = Object.keys(cc).length ? true : false;
        }
        else {
          this.inCombat = false;
        }
      }
    );

    // Listen focus Call from another component
    this.inputService.isFocussed.pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.focus();
      });
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


  sendCmd(cmd: string) {
    this.game.processCommands(cmd);
  }

  @HostListener('window:keydown', ['$event'])
  onLastCommandSend(event: KeyboardEvent) {

    if (event.which === 49 && event.shiftKey === true && (this.ic.nativeElement.value).length === 0) {
      const l = this.historyService.cmd_history.length;

      if (l > 0) {
        this.game.processCommands(this.historyService.cmd_history[l - 1]);
      }
      return false;
    }
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
