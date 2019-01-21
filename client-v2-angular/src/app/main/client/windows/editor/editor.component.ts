import { Component, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ModalConfiguration } from 'src/app/models/client/modal.interface';
import { DataState } from 'src/app/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { DialogService } from 'src/app/main/common/dialog/dialog.service';
import { getEditor } from 'src/app/store/selectors';
import { IEditor } from 'src/app/models/data/editor.model';
import { takeUntil } from 'rxjs/operators';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tg-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {

  editorRequest$: Observable<any>;
  modalConfig: ModalConfiguration = new ModalConfiguration;
  dialogID: string = 'editor';

  description: string = '';
  dialogTitle: string = '';
  totalChars:number;

  private maxChars: number ;
  private maxLineLength: number = 80;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private store: Store<DataState>,
    private dialogService: DialogService,
    private gameService: GameService) {

      this._unsubscribeAll = new Subject<any>();

      this.modalConfig.showCloseButton = false;
      this.modalConfig.minHeight = 400;
      this.modalConfig.minWidth = 450;
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
  }

  private openEditor() {

    this.totalChars = this.maxChars - this.description.length;

    setTimeout(() => {
      this.dialogService.open(this.dialogID);
    });
  }


  onSave(descr: string) {
        const text = descr.split('\n');

        for (let l = 0; l < text.length; l++) {

            let remText = text[l]
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
                console.log(currline);
                this.gameService.sendToServer(`##ce${currline}`)
            }
        }
        this.gameService.sendToServer('##ce_save');
        this.dialogService.close(this.dialogID);
  }

  onCancel() { 
    this.gameService.sendToServer('##ce_abort');
    this.dialogService.close(this.dialogID);
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
