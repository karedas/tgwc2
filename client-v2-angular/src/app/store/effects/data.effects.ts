import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { GameService } from 'src/app/services/game.service';
import { tap } from 'rxjs/operators';

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

}
