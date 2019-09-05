import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientEventType } from '../actions/client.action';
import { Action, Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { AudioService } from 'src/app/main/client/components/audio/audio.service';
import { Router } from '@angular/router';
import { GameService } from 'src/app/main/client/services/game.service';
import { DialogV2Service } from '../../common/dialog-v2/dialog-v2.service';
import { LogService } from '../../services/log.service';
import { ClientState } from '../state/client.state';


export interface PayloadAction {
  type: string;
  payload: any;
}

@Injectable()
export class ClientEffects {

  constructor(
    private game: GameService,
    private actions$: Actions,
    private audioService: AudioService,
    private dialogV2Service: DialogV2Service,
    private router: Router,
    private gameService: GameService
  ) { }


  @Effect({ dispatch: false })
  onDisconnect: Observable<Action> = this.actions$.pipe(
    ofType(ClientEventType.DISCONNECT),
    tap((a) => {
      if (this.router.url === '/webclient') {
        this.audioService.pauseAudio();
        this.dialogV2Service.openSmartLogin();
        this.game.resetUI();
      }
    }
    ));

  @Effect({ dispatch: false })
  onGameStatus$: Observable<any> = this.actions$.pipe(
    ofType(ClientEventType.INGAME),
    tap(() => {
      console.log('TG-LOG: User logged-in game');
      this.gameService.processCommands('equip', false, false);
      this.gameService.processCommands('inventario', false, false);
    })
  );

  @Effect({ dispatch: false })
  disconnectAction$: Observable<any> = this.actions$.pipe(
    ofType(ClientEventType.DISCONNECT),
    tap(() => {
      const config = JSON.parse(localStorage.getItem('config'));
      if(config.logSave) {
        this.dialogV2Service.openLog();
      }
      console.log('TG-LOG: User Disconnected');
    })
  );

}
