import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DataState } from 'src/app/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { GameService } from 'src/app/services/game.service';
import { getEditor, getHero } from 'src/app/store/selectors';
import { takeUntil, map } from 'rxjs/operators';
import { IEditor } from 'src/app/models/data/editor.model';
import { WindowsService } from '../windows.service';
import { InputService } from '../../dashboard/input/input.service';

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

  private dialogRef: any;

  constructor(
    private store: Store<DataState>,
    private windowsService: WindowsService,
    private inputService: InputService,
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
          this.description = editorState.description;
          this.dialogTitle = editorState.title;
          this.maxChars = editorState.maxChars;
          this.HeroName$ = this.store.pipe(select(getHero), map(hero => hero.name));
          this.dialogRef = this.openEditor();
        }
      }
    );

  }

  private openEditor() {
    this.totalChars = this.maxChars - this.description.length;
    setTimeout(() => {
      this.windowsService.openEditor(this.dialogID, this.dialogTitle);
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
    this.windowsService.closeGenericDialog(this.dialogID);
    this.inputService.focus();
  }

  onCancel() {
    this.gameService.sendToServer('##ce_abort');
    this.windowsService.closeGenericDialog(this.dialogID);
    this.inputService.focus();
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
