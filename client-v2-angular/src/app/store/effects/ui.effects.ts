import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { GameService } from 'src/app/services/game.service';
import { tap, map, withLatestFrom, filter } from 'rxjs/operators';
import { UIEventType } from '../actions/ui.action';
import { getExtraOutputStatus } from '../selectors';
import { UIState } from '../state/ui.state';
import { CommandsListComponent } from 'src/app/main/client/windows/commands-list/commands-list.component';
import { DialogService } from 'src/app/main/common/dialog/dialog.service';
import { DialogConfiguration } from 'src/app/main/common/dialog/model/dialog.interface';

export interface PayloadAction {
  type: string;
  payload: any;
}

@Injectable()
export class UiEffects {

  constructor(
    private actions$: Actions,
    private game: GameService,
    private store: Store<UIState>,
    private dialogService: DialogService
  ) { }

    @Effect({dispatch: false})
    $updateUI$: Observable<any> = this.actions$.pipe(
      ofType(UIEventType.UPDATENEEDED),
      withLatestFrom(this.store.pipe(select(getExtraOutputStatus))),
      filter(([action, status]) => status === true ),
      map(([action, status]) => action),
      tap(
        what => {
          this.game.updateUIByData(what.payload);
        })
    );

    @Effect({dispatch: false})
    closeTextEditor: Observable<Action> = this.actions$.pipe(
      ofType(UIEventType.CLOSETEXTEDITOR),
      // tap(() => this.dialogService.close('editor'))
    );

    @Effect({dispatch: false})
    showCommands: Observable<Action> = this.actions$.pipe(
      ofType<PayloadAction>(UIEventType.SHOWCOMMANDS),
      map(action => action.payload),
      tap( cmds => {
        this.game.setCommands(cmds);
        setTimeout(() => {
          this.dialogService.open( 'commandsList', <DialogConfiguration>{
            header: 'Lista comandi',
            width: '750px',
            height: '500px',
            style: {"max-width": "100%", "max-height": "100%"},
            styleClass: 'op-100',
            blockScroll: true,
            modal: false,
            draggable: true,
            resizable: true
          });
        }, 100);
      })
    );




}
