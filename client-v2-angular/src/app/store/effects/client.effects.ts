import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientEventType } from '../actions/client.action';
import { Action } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { DataEvenType } from '../actions/data.action';

export interface PayloadAction {
  type: string;
  payload: any;
}

@Injectable()
export class ClientEffects {

  constructor(
    private actions$: Actions,
  ) { }
}
