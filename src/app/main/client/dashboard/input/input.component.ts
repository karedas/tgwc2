import { Component, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation, HostListener, OnDestroy, Renderer2, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { faColumns, faSolarPanel, faBullseye, faFont } from '@fortawesome/free-solid-svg-icons';

import { State } from 'src/app/store';
import { getHero } from 'src/app/store/selectors';

import { HistoryService } from 'src/app/services/history.service';
import { GameService } from 'src/app/services/game.service';
import { InputService } from './input.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'tg-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class InputComponent implements OnInit, OnDestroy {

  @ViewChild('inputCommand') ic: ElementRef;

  tgConfig: any;

  facolumns = faColumns;
  faSolarPanel = faSolarPanel;
  faBullseye = faBullseye;
  faFont = faFont;

  public inCombat = false;

  private _inCombat$: Observable<any>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private game: GameService,
    private store: Store<State>,
    private historyService: HistoryService,
    private inputService: InputService,
    private render: Renderer2,
    private _configService: ConfigService
  ) {

    this._inCombat$ = this.store.pipe(select(getHero));

    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {

    // Subscribe to config changes
    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.tgConfig = config;
      });


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
    this._configService.setConfig({
      layout: { extraOutput: !this.tgConfig.layout.extraOutput }
    })
  }

  toggleCharacterPanel(event: Event) {
    this._configService.setConfig({
      layout: { characterPanel: !this.tgConfig.layout.characterPanel }
    })
  }

  toggleZen(event: Event) {

    this._configService.setConfig({
      layout: { zen: !this.tgConfig.layout.zen }
    })

    if (this.tgConfig.layout.zen) {
      this.render.addClass(document.body, 'zen');
    } else {
      this.render.removeClass(document.body, 'zen');
    }
  }

  onFontSizeChange(){}

  sendCmd(cmd: string) {
    this.game.processCommands(cmd);
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
