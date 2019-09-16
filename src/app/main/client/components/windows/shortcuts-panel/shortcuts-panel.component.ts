import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { InputService } from '../../input/input.service';
import { GameService } from '../../../services/game.service';
import { TGConfig } from '../../../client-config';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'tg-shortcuts-panel',
  templateUrl: './shortcuts-panel.component.html',
  styleUrls: ['./shortcuts-panel.component.scss']
})
export class ShortcutsPanelComponent implements OnInit, OnDestroy {

  @Output() managerCall: EventEmitter<boolean> = new EventEmitter();

  totalShortcuts: Array<any>;
  cmdHoverId: number;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _configService: ConfigService,
    private inputService: InputService,
    private game: GameService,
  ) {

    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {
    this._configService.config
      .pipe(
        takeUntil(this._unsubscribeAll),
        map((config: TGConfig) => config.shortcuts))
      .subscribe((sc) => {
        this.totalShortcuts = sc;
      });
  }

  sendCmd(event: any, cmd: string) {
    this.game.processCommands(cmd);
    this.inputService.focus();
  }

  changeCmdLabel(val?: number | any) {
    this.cmdHoverId = val;
  }

  openShortcutManager() {
    this.managerCall.emit(true);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
