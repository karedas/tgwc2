import { Component, OnDestroy, AfterViewInit, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { UIState } from 'src/app/store/state/ui.state';
import { getWelcomeNews } from 'src/app/store/selectors';
import { takeUntil, filter } from 'rxjs/operators';
import { DialogService } from 'src/app/main/common/dialog/dialog.service';
import { DialogConfiguration } from 'src/app/main/common/dialog/model/dialog.interface';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgScrollbar } from 'ngx-scrollbar';

@Component({
  selector: 'tg-welcome-news',
  templateUrl: './welcome-news.component.html',
  styleUrls: ['./welcome-news.component.scss'],
})
export class WelcomeNewsComponent implements AfterViewInit, OnDestroy {

  @Output() newsIsNeeded: EventEmitter<boolean> = new EventEmitter();


  dialogID: string = 'welcomenews';
  
  @ViewChild(NgScrollbar) textAreaScrollbar: NgScrollbar;

  private welcomeNews: Observable<boolean>;
  private _unsubscribeAll: Subject<any>;
  private dontShowNextTime: boolean = false;

  constructor(
    private store: Store<UIState>,
    private game: GameService,
    private dialogService: DialogService,
  ) {
    this.welcomeNews = this.store.pipe(select(getWelcomeNews));
    this._unsubscribeAll = new Subject();
  }

  ngAfterViewInit(): void {

    this.welcomeNews.pipe(
        takeUntil(this._unsubscribeAll))
      .subscribe((req: boolean)=> {
          if (localStorage.getItem('welcomenews') && req === true) {
              this.newsIsNeeded.emit(false);
              this.game.sendToServer('');
          } else { 
            this.openDialog();
          }
        }
      )
  }

  openDialog() {
    setTimeout(() => {
      
      this.dialogService.open('welcomenews', <DialogConfiguration>{
        visible: true,
        width: '750px',
        height: '500px',
        modal: true
      });

      this.textAreaScrollbar.update();
    }, 100)
  }

  onContinue(): void {
    if (this.dontShowNextTime) {
      localStorage.setItem('welcomenews', '1');
    }

    this.dialogService.close(this.dialogID);
    this.newsIsNeeded.emit(false);
    this.game.sendToServer('');
  }

  onCheckbox(event: any): void {
    this.dontShowNextTime = !this.dontShowNextTime;
  }

  
  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
