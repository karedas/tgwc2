import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientEventType } from '../actions/client.action';
import { Action } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { AudioService } from 'src/app/main/client/audio/audio.service';

export interface PayloadAction {
  type: string;
  payload: any;
}

@Injectable()
export class ClientEffects {

  constructor(
    private actions$: Actions,
    private audioService: AudioService
  ) { }

  @Effect({dispatch: false})
  closeTextEditor: Observable<Action> = this.actions$.pipe(
    ofType(ClientEventType.DISCONNECT),
    tap(() => this.audioService.pauseAudio() )
  );

}
