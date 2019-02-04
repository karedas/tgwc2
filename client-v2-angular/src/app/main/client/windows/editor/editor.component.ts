import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DataState } from 'src/app/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { GameService } from 'src/app/services/game.service';
import { getEditor, getHero } from 'src/app/store/selectors';
import { takeUntil, map } from 'rxjs/operators';
import { IEditor } from 'src/app/models/data/editor.model';
import { DialogService } from 'src/app/main/common/dialog/dialog.service';
import { DialogConfiguration } from 'src/app/main/common/dialog/model/dialog.interface';

@Component({
  selector: 'tg-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {

  dialogID = 'editor';

  editorRequest$: Observable<any>;
  HeroName$: Observable<string>;

  description = '';
  dialogTitle = '';
  totalChars: number;

  private maxChars: number;
  private maxLineLength = 80;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private dialogService: DialogService,
    private gameService: GameService) {

    this._unsubscribeAll = new Subject<any>();

  }

  ngOnInit(): void {

    this.editorRequest$ = this.store.pipe(takeUntil(this._unsubscribeAll), select(getEditor));

    this.editorRequest$.subscribe(
      (editorState: IEditor) => {
        if (editorState) {
          this.description = editorState.description;
          this.dialogTitle = editorState.title;
          this.maxChars = editorState.maxChars;
          this.openEditor();
        }
      }
    );

    this.HeroName$ = this.store.pipe(select(getHero), map(hero => hero.name));
  }

  private openEditor() {

    this.totalChars = this.maxChars - this.description.length;

    setTimeout(() => {
      this.dialogService.open(this.dialogID, <DialogConfiguration>{
        width: '500px',
        height: '450px',
        resizable: true,
        draggable: true,
        maximizable: true,
        header: this.dialogTitle
      });
    });
  }

  onSave(descr: string) {
    const text = descr.split('\n');

    for (let l = 0; l < text.length; l++) {

      let remText = text[l];
      while (remText.length > 0) {

        let currline: any,
          slicepos = remText.lastIndexOf(' ', this.maxLineLength);

        if (slicepos > 0) {
          currline = remText.slice(0, slicepos) + '\\';
          remText = remText.slice(slicepos);
        } else {
          currline = remText;
          remText = '';
        }
        this.gameService.sendToServer(`##ce${currline}`);
      }
    }
    this.gameService.sendToServer('##ce_save');
  }

  onCancel() {
    this.gameService.sendToServer('##ce_abort');
  }

  onDescrChange($event) {
    const text_length = $event.length;
    this.totalChars = this.maxChars - text_length;
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
