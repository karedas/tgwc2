import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { ClientEventType, inGameAction } from '../actions/client.action';
import { Store } from '@ngrx/store';
import { tap, mapTo, map, concatMap, switchMap, filter } from 'rxjs/operators';
import { AudioService } from 'src/app/main/client/components/audio/audio.service';
import { Router } from '@angular/router';
import { GameService } from 'src/app/main/client/services/game.service';
import { DialogV2Service } from '../../common/dialog-v2/dialog-v2.service';
import { ClientState } from '../state/client.state';
import { LoginClientService } from 'src/app/main/authentication/services/login-client.service';
import { PayloadActionData } from './data.effects';
import { TGAudio } from '../../models/audio.model';

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
          // Stop Audio
          this.audioService.pauseAudio();
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

  audio$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<PayloadAction>(ClientEventType.AUDIO),
        map(action => action.payload),
        filter(state => !!state ),
        tap(( audio: TGAudio ) => {
          console.log('go?');
          this.audioService.setAudio({channel: 'atmospheric', track: 'rain-and-thunder-loop.mp3'});
        })
      ),
    { dispatch: false }
  );

  constructor(
    private game: GameService,
    private actions$: Actions,
    private audioService: AudioService,
    private dialogV2Service: DialogV2Service,
    private router: Router,
    private loginService: LoginClientService
  ) {}
}
