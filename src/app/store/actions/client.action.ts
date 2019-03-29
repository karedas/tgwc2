import { Action } from '@ngrx/store';

export enum UIType {
  UPDATE = '[UI] Update',
}

export enum ClientEventType {
  DISCONNECT = '[Client] User Disconnect',
  LOGIN_FAILURE = '[Client] User Login Failure',
  INGAME = '[Client] User In Game',
  RESET = '[Client] Reset for New Login'
}

export class DisconnectAction implements Action {
  readonly type = ClientEventType.DISCONNECT;
}

export class ResetAction implements Action {
  readonly type = ClientEventType.RESET;
}


export type ClientActions
  = DisconnectAction
  | ResetAction;
