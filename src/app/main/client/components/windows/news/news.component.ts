import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/main/client/services/game.service';

import { NgScrollbar } from 'ngx-scrollbar';
import { ConfigService } from 'src/app/services/config.service';
import { MatDialogRef, MatCheckboxChange } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { TGConfig } from '../../../client-config';
import { Subject } from 'rxjs';

@Component({
  selector: 'tg-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent  implements OnInit, OnDestroy {


  @ViewChild(NgScrollbar) textAreaScrollbar: NgScrollbar;

  checked = '';

  private _unsubscribeAll: Subject<any>;

  constructor(
    private game: GameService,
    private _configService: ConfigService,
    private dialogRef: MatDialogRef<NewsComponent>,
  ) {
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit(): void {
    this.dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        this.textAreaScrollbar.update();
      });
    });

    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: TGConfig) => {
        this.checked  = config.news ? '' : 'checked' ;
      });

  }

  onContinue(): void {
    // Save Next Login News display based on user's choice
    this.game.sendToServer('');
  }

  onCheckbox(event: MatCheckboxChange): void {
    this._configService.setConfig({
      news: !event.checked
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
