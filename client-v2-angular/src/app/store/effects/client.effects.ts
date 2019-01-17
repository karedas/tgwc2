import { Effect, Actions, ofType } from '@ngrx/effects';
import { ClientEventType, ClientActions, LoginSuccessAction } from '../actions/client.action';
import { tap, map, exhaustMap, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { GameService } from 'src/app/services/game.service';


export interface PayloadAction {
  type: string;
  payload: any;
}


@Injectable()
export class ClientEffects {
  constructor(
    private actions$: Actions,
    private game: GameService
  ) { }


  // @Effect({ dispatch: false })
  // 	playerUpdate$ = this.actions$.pipe(
  //     ofType<PayloadAction>(ClientEventType.LOGINSUCCESS),
  //     map(action => action.payload),
  //     tap(loginType => {
  //       console.log('yo');
  //       if(loginType === 'login') {
  //         // this.game.showNews;
  //       }
  //       else if (loginType === 'reconnect') {
  //       }
  //     })
  // )
}
