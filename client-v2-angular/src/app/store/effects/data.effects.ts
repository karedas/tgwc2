import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap, map, switchMap} from 'rxjs/operators';
import { DataEvenType, RoomAction, IncomingData } from '../actions/data.action';
import { Action } from '@ngrx/store';
import { GameService } from 'src/app/services/game.service';

export interface PayloadAction {
  type: string;
  payload: any;
}


@Injectable()
export class DataEffects {

  constructor(
    private actions$: Actions,
    private game: GameService
  ) { }

  // @Effect({dispatch: false})
  // base$: Observable<Action> = this.actions$.pipe(
  //   ofType<IncomingData>(DataEvenType.IN),
  //   tap((action: PayloadAction) => console.log('c\'è stato un add!' , action.payload)
  // ));
}
