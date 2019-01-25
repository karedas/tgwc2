import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

export interface PayloadActionData {
  type: string;
  payload: any;
}


@Injectable()
export class DataEffects {

  // private last: number =  0;

  // @Effect({dispatch: false})
  // updateNeeded$: Observable<Action> = this.actions$.pipe(
  //   ofType(DataEvenType.UPDATENEEDED),
  //   withLatestFrom(()  => {
  //       this.store.select(getVersions);
  //   }),
  //   tap((action: any )  => {
  //     console.log(action);
  //   }),
  // );

  constructor(
    private actions$: Actions,
    // private game: GameService,
    // private store: Store<DataState>
  ) { }
}
