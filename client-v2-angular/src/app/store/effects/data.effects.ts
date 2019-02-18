import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DataEvenType, HeroAction } from '../actions/data.action';
import { switchMap, tap } from 'rxjs/operators';
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
        new HeroAction({skills: res.payload})
      ]
    })
  );

  @Effect()
  equipRequest: Observable<Action> = this.actions$.pipe(
    ofType<PayloadActionData>(DataEvenType.EQUIP),
    switchMap((res) => {
        this.windowsService.openCharacterSheet('eqinv')
        return [
          new HeroAction({equipment: res.payload})
        ]
    }),
  );
}
