import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DataState } from 'src/app/main/client/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { getEditor, getHero } from 'src/app/main/client/store/selectors';
import { takeUntil, map, filter, take } from 'rxjs/operators';
import { InputService } from '../../input/input.service';
import { IEditor } from 'src/app/main/client/models/data/editor.model';
import { MatDialogRef } from '@angular/material/dialog';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'tg-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {

  public readonly dialogID: string = 'editor';

  editorRequest$: Observable<any>;
  HeroName$: Observable<string>;

  description = '';
  dialogTitle = '';
  totalChars: number;
  maxChars: number;


  private maxLineLength = 80;
  private _unsubscribeAll: Subject<any>;


  constructor(
    private store: Store<DataState>,
    private inputService: InputService,
    public dialog: MatDialogRef<EditorComponent>,
    private gameService: GameService) {
    this._unsubscribeAll = new Subject<any>();

    this.editorRequest$ = this.store.pipe(takeUntil(this._unsubscribeAll), select(getEditor));
  }

  ngOnInit(): void {
    this.editorRequest$.pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe(
      (editorState: IEditor) => {
        if (editorState !== undefined) {
          this.description = editorState.description.replace(/\n/gm, ' ');
          this.dialogTitle = editorState.title;
          this.maxChars = editorState.maxChars;

          this.HeroName$ = this.store.pipe(select(getHero), map(hero => hero.name));
        }
      }
    );

    this.dialog.keydownEvents()
      .pipe(
        filter((e: KeyboardEvent) => e.code === 'Escape'),
        take(1)
      )
      .subscribe(() => {
        this.gameService.sendToServer('##ce_abort');
        this.dialog.close();
        this.inputService.focus();
      });
  }


  onSave(descr: string) {
    const text = descr.split('\n');

    for (let l = 0; l < text.length; l++) {

      let remText = text[l];
      while (remText.length > 0) {

        let currline: any;
        const slicepos = remText.lastIndexOf(' ', this.maxLineLength);

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
    this.dialog.close();
    this.inputService.focus();
  }

  onCancel(event: any) {
    this.gameService.sendToServer('##ce_abort');
    this.dialog.close();
  }

  resetEditor() {
    this.description = '';
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
