import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { GameService } from 'src/app/services/game.service';
import { tap, map, withLatestFrom, filter, catchError } from 'rxjs/operators';
import { UIEventType } from '../actions/ui.action';
import { DialogService } from 'src/app/main/common/dialog/dialog.service';
import { getExtraOutputStatus } from '../selectors';
import { UIState } from '../state/ui.state';

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
          this.game.updateUIByData(what.payload)
        })
    );

    @Effect({dispatch: false})
    closeTextEditor: Observable<Action> = this.actions$.pipe(
      ofType(UIEventType.CLOSETEXTEDITOR),
      tap(() => this.dialogService.close('editor'))
    );

    @Effect({dispatch: false})
    showCommands: Observable<Action> = this.actions$.pipe(
      ofType<PayloadAction>(UIEventType.SHOWCOMMANDS),
      map(action => action.payload),
      tap( cmds => {
        this.game.setCommands(cmds);
        setTimeout(() => {
          this.dialogService.open('commandsList');
        }, 100);
      })
    );


    

}
