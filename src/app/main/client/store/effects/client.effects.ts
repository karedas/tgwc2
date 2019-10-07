import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mapTo, tap } from 'rxjs/operators';
import { LoginClientService } from 'src/app/main/authentication/services/login-client.service';
import { GameService } from 'src/app/main/client/services/game.service';

import { DialogV2Service } from '../../common/dialog-v2/dialog-v2.service';
import { ClientEventType, inGameAction } from '../actions/client.action';

export interface PayloadAction {
  type: string;
  payload: any;
}

@Injectable()
export class ClientEffects {

  onDisconnect$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadAction>(ClientEventType.DISCONNECT),
      tap(() => {
        const config = JSON.parse(localStorage.getItem('config'));
        if (this.router.url === '/webclient') {
          // Open the Smart Login Box
          this.dialogV2Service.openSmartLogin();
          // If Log save is true: open Log Service Dialog
          if (config.logSave) {
            this.dialogV2Service.openLog();
          }
          this.game.resetUI();
          this.loginService.isInGame = false;
        }
      }),
      mapTo(inGameAction({ payload: false }))
    )
  );

  inGame$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<PayloadAction>(ClientEventType.INGAME),
        map(res => res.payload),
        tap(ingame => {
          if (ingame === true) {
            this.game.processCommands(' ', false);
          }
        })
      ),
    { dispatch: false }
  );

  constructor(
    private game: GameService,
    private actions$: Actions,
    private dialogV2Service: DialogV2Service,
    private router: Router,
    private loginService: LoginClientService
  ) {}
}
