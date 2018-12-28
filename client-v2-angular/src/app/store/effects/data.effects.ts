import { Injectable } from "@angular/core";
import { Actions, Effect, ofType,} from '@ngrx/effects';
import { Observable } from "rxjs";
import { tap} from 'rxjs/operators';
import { DataEvenType } from "../actions/data.action";

@Injectable()
export class MessageEffects {

  constructor(
    private actions$: Actions,
  ) { }

  @Effect({dispatch: false})
  emit$: Observable<any> = this.actions$.pipe(
    ofType(DataEvenType.IN),
    tap( action => {
    }),
  )
    // map((action: EmitAction) => {
    //   console.log('action', action);
    // })
}