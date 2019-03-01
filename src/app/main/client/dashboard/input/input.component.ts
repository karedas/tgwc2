import { Component, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation, HostListener, OnDestroy, Renderer2 } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { faColumns, faSolarPanel, faBullseye } from '@fortawesome/free-solid-svg-icons';

import { State } from 'src/app/store';
import { getHero, getExtraOutputStatus, getDashboardVisibility } from 'src/app/store/selectors';

import { HistoryService } from 'src/app/services/history.service';
import { GameService } from 'src/app/services/game.service';
import { InputService } from './input.service';
import { ToggleExtraOutput, ToggleDashboard } from 'src/app/store/actions/ui.action';

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

  _extraOutputStatus$: Observable<boolean>;
  _dashBoardStatus$: Observable<boolean>;

  public zenStatus = false;

  private _inCombat$: Observable<any>;
  inCombat = false;


  private _unsubscribeAll: Subject<any>;

  constructor(
    private game: GameService,
    private store: Store<State>,
    private historyService: HistoryService,
    private inputService: InputService,
    private render: Renderer2
  ) {

    this._extraOutputStatus$ = this.store.pipe(select(getExtraOutputStatus));
    this._dashBoardStatus$ = this.store.pipe(select(getDashboardVisibility));

    this._inCombat$ = this.store.pipe(select(getHero));

    this._unsubscribeAll = new Subject();
  }

  ngAfterViewInit() {

    this._inCombat$.pipe(
      takeUntil(this._unsubscribeAll),
      filter(state => !!state)).subscribe(
      (cc) => {
        if (cc.target && typeof cc.target.hit !== 'undefined') {
          this.inCombat = Object.keys(cc).length ? true : false;
        } else {
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

    if(!this.game.mouseIsOnMap) {
      const cmd = this.historyService.getPrevious();
      if (cmd) {
        event.target.value = cmd;
        this.moveCursorAtEnd(event.target);
      }
    }
  }

  onDownKey(event: any) {
    
    event.preventDefault();

    if(!this.game.mouseIsOnMap) {
      const cmd = this.historyService.getNext();
      if (cmd) {
        event.target.value = cmd;
        this.moveCursorAtEnd(event.target);
      }
    }
  }

  private moveCursorAtEnd(target) {
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
    this.store.dispatch(new ToggleExtraOutput(null));
  }

  toggleDashboard(event: Event) {
    this.store.dispatch(new ToggleDashboard());
  }

  toggleZen(event: Event) {
    this.zenStatus = !this.zenStatus;
    if (this.zenStatus) {
      this.render.addClass(document.body, 'zen');
    } else {
      this.render.removeClass(document.body, 'zen');
    }
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
