import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DataEvenType, HeroAction } from '../actions/data.action';
import { tap, withLatestFrom, switchMap } from 'rxjs/operators';
import { GameService } from 'src/app/services/game.service';
import { WindowsService } from 'src/app/main/client/windows/windows.service';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

export interface PayloadActionData {
  type: string;
  payload: any;
}


@Injectable()
export class DataEffects {

  constructor(
    private actions$: Actions,
    private windowsService: WindowsService,
    // private game: GameService,
  ) { }

  @Effect()
  skillsRequest$: Observable<Action> = this.actions$.pipe(
    ofType<PayloadActionData>(DataEvenType.SKILLS),
    switchMap((res) => {
      this.windowsService.openCharacterSheet('skills')
      return [
        new HeroAction(res.payload)
      ]
    })
  );

  @Effect()
  equipRequest: Observable<Action> = this.actions$.pipe(
    ofType<PayloadActionData>(DataEvenType.EQUIP),
    switchMap((res) => {
        this.windowsService.openCharacterSheet('eqinv')
        return [
          new HeroAction(res.payload)
        ]
    }),
  );
}
