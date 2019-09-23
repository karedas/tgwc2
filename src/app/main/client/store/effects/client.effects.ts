import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { ClientEventType, inGameAction } from '../actions/client.action';
import { Store } from '@ngrx/store';
import { tap, mapTo } from 'rxjs/operators';
import { AudioService } from 'src/app/main/client/components/audio/audio.service';
import { Router } from '@angular/router';
import { GameService } from 'src/app/main/client/services/game.service';
import { DialogV2Service } from '../../common/dialog-v2/dialog-v2.service';
import { TGState } from '..';


export interface PayloadAction {
  type: string;
  payload: any;
}

@Injectable()
export class ClientEffects {


  onDisconnect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientEventType.DISCONNECT),
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
        }
        this.store.dispatch(inGameAction());
      }),
      mapTo( inGameAction() )
    ),
  );

  constructor(
    private game: GameService,
    private actions$: Actions,
    private audioService: AudioService,
    private dialogV2Service: DialogV2Service,
    private router: Router,
    private store: Store<TGState>
  ) { }
}
