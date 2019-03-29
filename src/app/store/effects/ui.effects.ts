import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { GameService } from 'src/app/services/game.service';
import { tap, map, withLatestFrom, filter, switchMap } from 'rxjs/operators';
import { UIEventType } from '../actions/ui.action';
import { UIState } from '../state/ui.state';
import { WindowsService } from 'src/app/main/client/windows/windows.service';
import { HeroAction, InfoCharacterAction } from '../actions/data.action';
import { ConfigService } from 'src/app/services/config.service';
import { getInGameStatus } from '../selectors';

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
  ) { console.log('effects')}

  // @Effect({ dispatch: false })
  // $updateUI: Observable<any> = this.actions$.pipe(
  //   ofType(UIEventType.UPDATENEEDED),
  //   withLatestFrom(this.store.pipe(select(getExtraOutputStatus))),
  //   filter(([action, status]) => status === true),
  //   map(([action, status]) => action),
  //   tap(
  //     what => {
  //       this.game.updateNeeded(what.payload);
  //     })
  // );

  @Effect({ dispatch: false})
  showNews$: Observable<boolean | Action> = this.actions$.pipe(
    ofType(UIEventType.NEWS),
    withLatestFrom(this.store.pipe(select(getInGameStatus))),
    map(([action, status]) => {
      console.log('ok');
      this.windowsService.openNews(status);
      return status;
    }),
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

  @Effect()
  showStatusInline$ = this.actions$.pipe(
    ofType<PayloadAction>(UIEventType.SHOWSTATUSHERO),
    switchMap((res) => {
        return [
          new HeroAction(res.payload)
        ];
    }),
    tap(() => this.game.setStatusInline(true))
  );

  @Effect({ dispatch: false })
  refreshCommand$ = this.actions$.pipe(
    ofType(UIEventType.REFRESH),
    tap(() => {
      this.game.processCommands('info');
    }));




}
