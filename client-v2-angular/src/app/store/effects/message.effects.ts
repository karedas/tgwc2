import { Injectable } from "@angular/core";
import { LoginService } from "src/app/authentication/services/login.service";
import { Actions, Effect, ofType,} from '@ngrx/effects';
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map, tap, filter} from 'rxjs/operators';
import { MessageEventType, MessageAction } from "../actions/message.action";

@Injectable()
export class MessageEffects {

  constructor(
    private actions$: Actions,
    private loginService: LoginService,
    private router: Router
  ) { }

  @Effect({dispatch: false})
  emit$: Observable<any> = this.actions$.pipe(
    ofType(MessageEventType.IN),
    tap( action => {
    }),
  )
    // map((action: EmitAction) => {
    //   console.log('action', action);
    // })
}