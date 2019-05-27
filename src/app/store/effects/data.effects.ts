import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DataEvenType, HeroAction } from '../actions/data.action';
import { switchMap, tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { DialogV2Service } from 'src/app/main/client/common/dialog-v2/dialog-v2.service';

export interface PayloadActionData {
  type: string;
  payload: any;
}


@Injectable()
export class DataEffects {
  constructor(
    private actions$: Actions,
    private dialogV2Service: DialogV2Service
  ) { }

  @Effect({ dispatch: false })
  openEditor$: Observable<Action> = this.actions$.pipe(
    ofType<PayloadActionData>(DataEvenType.EDITOR),
    tap((data) => {
      this.dialogV2Service.openEditor();
    })
  );

  @Effect()
  skillsRequest$: Observable<Action> = this.actions$.pipe(
    ofType<PayloadActionData>(DataEvenType.SKILLS),
    switchMap((res) => {
      this.dialogV2Service.openCharacterSheet('skills');
      return [
        new HeroAction({skills: res.payload})
      ];
    })
  );


  @Effect()
  equipRequest$: Observable<Action> = this.actions$.pipe(
    ofType<PayloadActionData>(DataEvenType.EQUIP),
    switchMap((res) => {
        this.dialogV2Service.openCharacterSheet('equip');
        return [
          new HeroAction({equipment: res.payload})
        ];
    }),
  );

  @Effect()
  inventoryRequest$: Observable<Action> = this.actions$.pipe(
    ofType<PayloadActionData>(DataEvenType.INVENTORY),
    switchMap((res) => {
        this.dialogV2Service.openCharacterSheet('inventory');
        return [
          new HeroAction({inventory: res.payload})
        ];
    }),
  );

  @Effect({ dispatch: false })
  openBook$: Observable<any | Action> = this.actions$.pipe(
    ofType(DataEvenType.BOOK),
    tap((data: PayloadActionData) => {
      this.dialogV2Service.openBook(data.payload, 0);
    })
  );

  @Effect({ dispatch: false })
  genericTable$: Observable<Action> = this.actions$.pipe(
    ofType<PayloadActionData>(DataEvenType.GENERICTABLE),
    tap((res) => {
      this.dialogV2Service.openGenericTable();
    })
  );

  @Effect({ dispatch: false })
  worksList$: Observable<Action> = this.actions$.pipe(
    ofType<PayloadActionData>(DataEvenType.WORKSLIST),
    tap((res) => {
      this.dialogV2Service.openWorksList();
    })
  );

}
