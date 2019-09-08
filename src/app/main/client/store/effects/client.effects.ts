import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { ClientEventType, inGameAction } from '../actions/client.action';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
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
        if (config.logSave) {
          this.dialogV2Service.openLog();
        }
        if (this.router.url === '/webclient') {
          this.audioService.pauseAudio();
          this.dialogV2Service.openSmartLogin();
          this.game.resetUI();
        }
        this.store.dispatch(inGameAction())
      },
      )
    ),
    { dispatch: false }
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
