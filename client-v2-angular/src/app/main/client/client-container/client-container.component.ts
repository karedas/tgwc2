import { Component, OnDestroy, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { UIState } from 'src/app/store/state/ui.state';
import { getWelcomeNews, getEditor } from 'src/app/store/selectors';
import { Subject, Observable } from 'rxjs';
import { DialogService } from '../../common/dialog/dialog.service';
import { GameService } from 'src/app/services/game.service';
import { takeUntil } from 'rxjs/operators';
import { IEditor } from 'src/app/models/data/editor.model';

@Component({
  selector: 'tg-client-container',
  templateUrl: './client-container.component.html',
  encapsulation: ViewEncapsulation.None

})
export class ClientContainerComponent implements OnDestroy, AfterViewInit {
  private _unsubscribeAll: Subject<any>;
  private welcomeNews: Observable<boolean>;
  private editorDialog: Observable<any>;


  constructor(
    private store: Store<UIState>,
    private dialogService: DialogService,
    private game: GameService
  ) {

    this._unsubscribeAll = new Subject();

    this.welcomeNews = this.store.pipe(takeUntil(this._unsubscribeAll),select(getWelcomeNews));
    this.editorDialog = this.store.pipe(takeUntil(this._unsubscribeAll), select(getEditor));

  }

  ngAfterViewInit(): void {

    if (localStorage.getItem('welcomenews')) {
      this.game.sendToServer('');
      return;
    }

    //welcome news  
    this.welcomeNews.subscribe(
      (request: boolean) => {
        if (request === true) {
          setTimeout(() => {
            this.dialogService.openWelcomeNews();
          })
        }
      }
    )

    //Editor Dialog
    this.editorDialog.subscribe(
        (editorState: IEditor) => {
          console.log(editorState);
          if (editorState) {
            console.log(editorState);
            this.dialogService.openEditor(editorState);
            // this.description = editorState.description;
            // this.dialogTitle = editorState.title;
            // this.maxChars = editorState.maxChars;
            // this.openEditor();
          }
        }
      );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
