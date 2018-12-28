import { Effect, Actions, ofType } from "@ngrx/effects";
import { ClientEventType } from "../actions/client.action";
import { tap } from "rxjs/operators";
import { Injectable } from "@angular/core";

@Injectable()
export class ClientEffects {
	constructor(
		private actions$: Actions
	) { }

	// @Effect({ dispatch: false })
	// disconnect$ = this.actions$.pipe(
	// 	ofType(ClientEventType.DISCONNECT),
	// 	tap(action => {
	// 		console.log(action);
	// 	})
	// )
}