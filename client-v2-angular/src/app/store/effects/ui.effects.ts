import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { GameService } from 'src/app/services/game.service';
import { tap, map, withLatestFrom, filter, switchMap } from 'rxjs/operators';
import { UIEventType } from '../actions/ui.action';
import { getExtraOutputStatus } from '../selectors';
import { UIState } from '../state/ui.state';
import { WindowsService } from 'src/app/main/client/windows/windows.service';
import { HeroAction, SkillsAction, InventoryAction, EquipAction, InfoCharacterAction } from '../actions/data.action';

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
    private windowsService: WindowsService,
  ) { }

  @Effect({ dispatch: false })
  $updateUI: Observable<any> = this.actions$.pipe(
    ofType(UIEventType.UPDATENEEDED),
    withLatestFrom(this.store.pipe(select(getExtraOutputStatus))),
    filter(([action, status]) => status === true),
    map(([action, status]) => action),
    tap(
      what => {
        this.game.updateUIByData(what.payload);
      })
  );

  @Effect({ dispatch: false })
  closeTextEditor: Observable<Action> = this.actions$.pipe(
    ofType(UIEventType.CLOSETEXTEDITOR),
    // tap(() => this.dialogService.close('editor'))
  );

  @Effect({ dispatch: false })
  showCommande$: Observable<Action> = this.actions$.pipe(
    ofType<PayloadAction>(UIEventType.SHOWCOMMANDS),
    map(action => action.payload),
    tap(cmds => {
      this.game.setCommands(cmds);
      setTimeout(() => {
        this.windowsService.openCommandsList();
      }, 100);
    })
  );

  @Effect()
  showCharacterSheet$ = this.actions$.pipe(
    ofType<PayloadAction>(UIEventType.SHOWCHARACTERSHEET),
    switchMap((res) => {

      this.windowsService.openCharacterSheet(res.payload[1]);
      if (res.payload[1] === 'info') {
        return [
          new InfoCharacterAction(),
          new HeroAction(res.payload[0])
        ];
      }
    }),
  );

  @Effect({ dispatch: false })
  refreshCommand$ = this.actions$.pipe(
    ofType(UIEventType.REFRESH),
    tap(() => {
      this.game.processCommands('info');
    }));




}
