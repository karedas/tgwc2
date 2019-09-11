import { Component, ViewChild, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { TGState } from 'src/app/main/client/store';
import { getHero } from 'src/app/main/client/store/selectors';

import { HistoryService } from 'src/app/main/client/services/history.service';
import { GameService } from 'src/app/main/client/services/game.service';
import { InputService } from './input.service';
import { ConfigService } from 'src/app/services/config.service';
import { DialogV2Service } from '../../common/dialog-v2/dialog-v2.service';
import { OutputService } from '../output/output.service';

@Component({
  selector: 'tg-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})

export class InputComponent implements OnInit, OnDestroy {

  @ViewChild('inputCommand', { static: true }) ic: ElementRef;

  tgConfig: any;

  public inCombat = false;
  public pauseScroll = false;

  private _inCombat$: Observable<any>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private game: GameService,
    private store: Store<TGState>,
    private historyService: HistoryService,
    private inputService: InputService,
    private outputService: OutputService,
    private dialogService: DialogV2Service,
    private _configService: ConfigService
  ) {

    this._inCombat$ = this.store.pipe(select(getHero));

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    // Subscribe to config changes
    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.tgConfig = config;
      });


    this._inCombat$
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter(state => !!state))
      .subscribe(
        (cc) => {
          if (cc.target && typeof cc.target.hit !== 'undefined') {
            this.inCombat = Object.keys(cc).length ? true : false;
          } else {
            this.inCombat = false;
          }
        }
      );

    // Listen focus Call from another component
    this.inputService.isFocussed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.focus();
      });
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

  focus() {
    this.ic.nativeElement.focus();
  }

  onEnter(event: any, val: string) {
    event.target.value = '';
    this.sendCmd(val);
  }

  onUpKey(event: any) {

    event.preventDefault();

    if (!this.game.mouseIsOnMap) {
      const cmd = this.historyService.getPrevious();
      if (cmd) {
        event.target.value = cmd;
        this.moveCursorAtEnd(event.target);
      }
    }
  }

  onDownKey(event: any) {
    event.preventDefault();
    if (!this.game.mouseIsOnMap) {
      const cmd = this.historyService.getNext();
      if (cmd) {
        event.target.value = cmd;
        this.moveCursorAtEnd(event.target);
      }
    }
  }

  public sendCmd(cmd: string) {
    /* Check equipment/inventory dialog open request
       TODO: Need better implementation */
    if (cmd.startsWith('eq') || cmd.startsWith('inv') || cmd.startsWith('info') || cmd.startsWith('ab')) {
        this.game.processCommands(cmd, false, true);
    } else {
      this.game.processCommands(cmd, true, false);
    }

  }

  /*------  Buttons Actions */

  pauseScrollOutput() {
    this.pauseScroll = this.outputService.toggleAutoScroll();
  }

  openShortCut() {
    this.dialogService.openShortcut();
  }

  toggleExtraOutput(event: Event) {
    this._configService.setConfig({
      output: { extraArea: { visible: !this.tgConfig.output.extraArea.visible } }
    });
  }

  toggleCharacterPanel(event: Event) {
    this._configService.setConfig({
      characterPanel: !this.tgConfig.characterPanel
    });
  }

  toggleZen(event?: Event) {
    this._configService.setConfig({
      zen: !this.tgConfig.zen
    });
  }

  onFontSizeChange(): void {
    this.game.setOutputSize();
  }

  @HostListener('document:keypress', ['$event'])
  onLastCommandSend(event: KeyboardEvent) {
    if (event.key === '!' && (this.ic.nativeElement.value).length === 0) {
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
