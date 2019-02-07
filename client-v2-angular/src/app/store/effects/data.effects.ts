import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

export interface PayloadActionData {
  type: string;
  payload: any;
}


@Injectable()
export class DataEffects {

  constructor(
    private actions$: Actions,
    // private game: GameService,
    // private store: Store<DataState>
  ) { }
}
