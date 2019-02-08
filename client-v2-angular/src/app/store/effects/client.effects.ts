import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientEventType } from '../actions/client.action';
import { Action } from '@ngrx/store';
import { tap, skip } from 'rxjs/operators';
import { AudioService } from 'src/app/main/client/audio/audio.service';
import { WindowsService } from 'src/app/main/client/windows/windows.service';
import { LoginService } from 'src/app/main/authentication/services/login.service';
import { Router } from '@angular/router';

export interface PayloadAction {
  type: string;
  payload: any;
}

@Injectable()
export class ClientEffects {

  constructor(
    private actions$: Actions,
    private audioService: AudioService,
    private loginService: LoginService,
    private windowsService: WindowsService,
    private router: Router
  ) { }

  @Effect({dispatch: false})
  onDisconnect: Observable<Action> = this.actions$.pipe(
    ofType(ClientEventType.DISCONNECT),
    tap((a) => {
      if(this.router.url == '/webclient'){
        this.loginService.logout();
        this.audioService.pauseAudio();
        this.windowsService.openSmartLogin();
      } 
    }
  ));

}
