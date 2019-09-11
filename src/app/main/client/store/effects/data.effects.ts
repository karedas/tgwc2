import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { DataEvenType, heroAction } from '../actions/data.action';
import { switchMap, tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { DialogV2Service } from 'src/app/main/client/common/dialog-v2/dialog-v2.service';
import { GameService } from '../../services/game.service';
import * as DataActions from '../actions/data.action';
import { InputService } from '../../components/input/input.service';

export interface PayloadActionData {
  type: string;
  payload: any;
  dialog?: any;
}


@Injectable()
export class DataEffects {


  openEditor$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadActionData>(DataEvenType.EDITOR),
      tap((data) => {
        this.dialogV2Service.openEditor();
      })
    ),
    { dispatch: false }
  );

  skillsRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadActionData>(DataEvenType.SKILLS),
      switchMap((res) => {
        if (res.dialog) {
          this.dialogV2Service.openCharacterSheet('skills');
        }
        return [
          heroAction({ payload: { skills: res.payload } })
        ];
      })
    )
  );

  equipRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadActionData>(DataEvenType.EQUIP),
      switchMap((res) => {
        if (res.dialog) {
          this.dialogV2Service.openCharacterSheet('equip');
        }
        return [
          heroAction({ payload: { equipment: res.payload } })
        ];
      }),
    )
  );

  inventoryRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadActionData>(DataEvenType.INVENTORY),
      switchMap((res) => {
        if (res.dialog) {
          this.dialogV2Service.openCharacterSheet('inventory');
        }
        return [
          heroAction({ payload: { inventory: res.payload } })
        ];
      }),
    )
  );

  openBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataEvenType.BOOK),
      tap((data: any) => {
        this.dialogV2Service.openBook(data.book, 0);
      })
    ),
    { dispatch: false }
  );

  genericTable$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadActionData>(DataEvenType.GENERICTABLE),
      tap((res) => {
        this.dialogV2Service.openGenericTable();
      })
    ),
    { dispatch: false }
  );

  worksList$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadActionData>(DataEvenType.WORKSLIST),
      tap((res) => {
        this.dialogV2Service.openWorksList();
      })
    ),
    { dispatch: false }
  );

  closeTextEditor = createEffect(() =>
    this.actions$.pipe(
      ofType(DataEvenType.CLOSETEXTEDITOR),
      tap(() => {
        this.dialogV2Service.dialog.getDialogById('editor').close();
        this.inputService.focus();
      })
    ),
    { dispatch: false }
  );

  showCommands$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadActionData>(DataEvenType.SHOWCOMMANDS),
      map(action => action.payload),
      tap(cmds => {
        setTimeout(() => {
          this.dialogV2Service.openCommandsList(cmds);
        });
      })
    ),
    { dispatch: false }
  );


  showCharacterSheet$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadActionData>(DataEvenType.SHOWCHARACTERSHEET),
      switchMap((res) => {
        this.dialogV2Service.openCharacterSheet(res.payload[1]);
        if (res.payload[1] === 'info') {
          return [
            DataActions.infoCharacterAction(),
            DataActions.heroAction({ payload: res.payload[0] })
          ];
        }
      })
    )
  );

  showStatusInline$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadActionData>(DataEvenType.SHOWSTATUSHERO),
      switchMap((res) => {
        return [DataActions.heroAction(res.payload)];
      }),
      tap(() => this.game.setStatusInline(true))
    ),
  );

  refreshCommand$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataEvenType.REFRESH),
      tap(() => {
        this.game.processCommands('info');
      })
    ),
    { dispatch: false }
  );

  // refreshCommand$ = createEffect(() =>
  //   this.actions$.pipe(),
  //   { dispatch: false }
  // )


  constructor(
    private actions$: Actions,
    private inputService: InputService,
    private game: GameService,
    private dialogV2Service: DialogV2Service
  ) { }
}
