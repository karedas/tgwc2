import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientEventType } from '../actions/client.action';
import { Action } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { AudioService } from 'src/app/main/client/components/audio/audio.service';
import { Router } from '@angular/router';
import { GameService } from 'src/app/main/client/services/game.service';
import { LoginClientService } from 'src/app/main/client/services/login-client.service';


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
    private loginClientService: LoginClientService,
    private router: Router,
  ) { }


  @Effect({ dispatch: false })
  onDisconnect: Observable<Action> = this.actions$.pipe(
    ofType(ClientEventType.DISCONNECT),
    tap((a) => {
      if (this.router.url === '/webclient') {
        this.loginClientService.logout();
        this.audioService.pauseAudio();
        // this.dialogV2Service.openSmartLogin();
        this.game.resetUI();
      }
    }
    ));

  @Effect({ dispatch: false })
  onGameStatus$: Observable<any> = this.actions$.pipe(
    ofType(ClientEventType.INGAME),
    tap(() => {
      console.log('TG-LOG: User logged-in game');
    })
  );

}
