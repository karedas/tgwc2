import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientEventType } from '../actions/client.action';
import { Action } from '@ngrx/store';
import { map } from 'rxjs/operators';

export interface PayloadAction {
  type: string;
  payload: any;
}

@Injectable()
export class ClientEffects {

  constructor(
    private actions$: Actions,
  ) { }


  // @Effect({dispatch: false})
  // AferDisconnection$: Observable<Action> = this.actions$.pipe(
  //   ofType(ClientEventType.DISCONNECT),
  //   map(data => {
  //     console.log(data);
  //     return data;
  //   })

  // )

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
}
