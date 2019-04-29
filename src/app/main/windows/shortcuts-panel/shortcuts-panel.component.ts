import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { GameService } from '../../client/services/game.service';

@Component({
  selector: 'tg-shortcuts-panel',
  templateUrl: './shortcuts-panel.component.html',
  styleUrls: ['./shortcuts-panel.component.scss']
})
export class ShortcutsPanelComponent implements OnInit, OnDestroy {

  @Output() onManagerCall = new EventEmitter();

  totalShortcuts: Array<any>;
  cmdHoverId: number;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _configService: ConfigService,
    private game: GameService,
  ) {
    
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {
    this._configService.getConfig()
      .pipe(
        takeUntil(this._unsubscribeAll),
        map((config) => {return config.shortcuts}))
      .subscribe((sc) => {
        this.totalShortcuts = sc;
      });
  }

  sendCmd(cmd: string) {
    this.game.processCommands(cmd);
  }

  changeCmdLabel(val: number) {
    this.cmdHoverId = val;
  }

  openShortcutManager() {
    this.onManagerCall.emit();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
