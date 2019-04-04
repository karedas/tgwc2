import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientEventType } from '../actions/client.action';
import { Action, Store, select } from '@ngrx/store';
import { map, withLatestFrom, tap, switchMap, filter } from 'rxjs/operators';
import { AudioService } from 'src/app/main/client/audio/audio.service';
import { LoginService } from 'src/app/main/authentication/services/login.service';
import { Router } from '@angular/router';
import { GameService } from 'src/app/main/client/services/game.service';
import { getInGameStatus } from '../selectors';
import { ClientState } from '../state/client.state';
import { InputService } from 'src/app/main/client/input/input.service';
import { InfoCharacterAction, HeroAction } from '../actions/data.action';
import { DialogV2Service } from 'src/app/main/common/dialog-v2/dialog-v2.service';


export interface PayloadAction {
  type: string;
  payload: any;
}

@Injectable()
export class ClientEffects {

  @Effect({ dispatch: false })
  onDisconnect: Observable<Action> = this.actions$.pipe(
    ofType(ClientEventType.DISCONNECT),
    tap((a) => {
      console.log('Disconnect!');
      if (this.router.url === '/webclient')  {
        this.loginService.logout();
        this.audioService.pauseAudio();
        this.dialogV2Service.openSmartLogin();
        this.game.reset();
      }}
    ));

  @Effect({dispatch: false})
  onGameStatus$ = this.actions$.pipe(
    ofType(ClientEventType.INGAME),
    tap(() => {
      this.inputService.focus();
    })
  );

  
  // @Effect({ dispatch: false })
  // $updateUI: Observable<any> = this.actions$.pipe(
  //   ofType(ClientEventType.UPDATENEEDED),
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
    ofType(ClientEventType.NEWS),
    withLatestFrom(this.store.pipe(select(getInGameStatus))),
    map(([action, status]) => {
      if( this.game.config.news ) {
        this.dialogV2Service.openNews();
      }
      else {
        this.game.sendToServer('');
      }
      return status;
    }),
  );

  @Effect({ dispatch: false })
  closeTextEditor: Observable<Action> = this.actions$.pipe(
    ofType(ClientEventType.CLOSETEXTEDITOR),
    // tap(() => this.dialogService.close('editor'))
  );

  @Effect({ dispatch: false })
  showCommande$: Observable<Action> = this.actions$.pipe(
    ofType<PayloadAction>(ClientEventType.SHOWCOMMANDS),
    map(action => action.payload),
    tap(cmds => {
      this.game.setCommands(cmds);
      setTimeout(() => {
        // this.windowsService.openCommandsList();
      });
    })
  );

  @Effect()
  showCharacterSheet$ = this.actions$.pipe(
    ofType<PayloadAction>(ClientEventType.SHOWCHARACTERSHEET),
    switchMap((res) => {
      // this.windowsService.openCharacterSheet(res.payload[1]);
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

  constructor(
    private game: GameService,
    private actions$: Actions,
    private audioService: AudioService,
    private loginService: LoginService,
    private dialogV2Service: DialogV2Service,
    private inputService: InputService,
    private router: Router,
    // private inputService: InputService,
    private store: Store<ClientState>
  ) { }

}
