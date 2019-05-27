import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientEventType } from '../actions/client.action';
import { Action, Store, select } from '@ngrx/store';
import { map, withLatestFrom, tap, switchMap, filter } from 'rxjs/operators';
import { AudioService } from 'src/app/main/client/components/audio/audio.service';
import { LoginService } from 'src/app/main/authentication/services/login.service';
import { Router } from '@angular/router';
import { GameService } from 'src/app/main/client/services/game.service';
import { getInGameStatus } from '../selectors';
import { ClientState } from '../state/client.state';
import { InputService } from 'src/app/main/client/components/input/input.service';
import { InfoCharacterAction, HeroAction } from '../actions/data.action';
import { DialogV2Service } from 'src/app/main/client/common/dialog-v2/dialog-v2.service';


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
    private loginService: LoginService,
    private dialogV2Service: DialogV2Service,
    private inputService: InputService,
    private router: Router,
    private store: Store<ClientState>
  ) { }


  @Effect({ dispatch: false })
  onDisconnect: Observable<Action> = this.actions$.pipe(
    ofType(ClientEventType.DISCONNECT),
    tap((a) => {
      if (this.router.url === '/webclient') {
        this.loginService.logout();
        this.audioService.pauseAudio();
        this.dialogV2Service.openSmartLogin();
        this.game.reset();
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


  @Effect({ dispatch: false })
  showNews$: Observable<boolean | Action> = this.actions$.pipe(
    ofType(ClientEventType.NEWS),
    withLatestFrom(this.store.pipe(select(getInGameStatus))),
    map(([action, status]) => {
      if (this.game.tgConfig.news) {
        this.dialogV2Service.openNews(false);
      } else {
        this.game.sendToServer('');
        this.inputService.focus();
      }
      return status;
    }),
  );

  @Effect({ dispatch: false })
  closeTextEditor: Observable<Action> = this.actions$.pipe(
    ofType(ClientEventType.CLOSETEXTEDITOR),
    // tap(() => this.dialogV2Service.close('editor'))
  );

  @Effect({ dispatch: false })
  showCommande$: Observable<Action> = this.actions$.pipe(
    ofType<PayloadAction>(ClientEventType.SHOWCOMMANDS),
    map(action => action.payload),
    tap(cmds => {
      this.game.setCommands(cmds);
      setTimeout(() => {
        this.dialogV2Service.openCommandsList();
      });
    })
  );

  @Effect()
  showCharacterSheet$ = this.actions$.pipe(
    ofType<PayloadAction>(ClientEventType.SHOWCHARACTERSHEET),
    switchMap((res) => {
      this.dialogV2Service.openCharacterSheet(res.payload[1]);
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
    ofType<PayloadAction>(ClientEventType.SHOWSTATUSHERO),
    switchMap((res) => {
      return [
        new HeroAction(res.payload)
      ];
    }),
    tap(() => this.game.setStatusInline(true))
  );

  @Effect({ dispatch: false })
  refreshCommand$ = this.actions$.pipe(
    ofType(ClientEventType.REFRESH),
    tap(() => {
      this.game.processCommands('info');
    }));
}
