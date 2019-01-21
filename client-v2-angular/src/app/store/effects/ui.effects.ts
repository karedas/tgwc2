import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { GameService } from 'src/app/services/game.service';
import { tap } from 'rxjs/operators';
import { UIEventType } from '../actions/ui.action';


@Injectable()
export class UiEffects {

  constructor(
    private actions$: Actions,
  ) { }

    @Effect({dispatch: false})
    updateUI: Observable<Action> = this.actions$.pipe(
      ofType(UIEventType.UPDATENEEDED),
      tap(data => console.log(data))
    )
}
