import { Action } from '@ngrx/store';

export enum UIType {
  UPDATE = '[UI] Update',
}

export enum ClientEventType {
  INITIALIZE = '[Client] Socket Initialize',
  CONNECT = '[Client] Socket Connect',
  DISCONNECT = '[Client] User Disconnect',
  LOGIN = '[Client] User Login',
  LOGIN_FAILURE = '[Client] User Login Failure',
  INGAME = '[Client] User In Game',
}

export class SocketStatusAction implements Action {
  readonly type = ClientEventType.CONNECT;
  constructor(public payload: string) {}
}

export class LoginAction implements Action {
  readonly type = ClientEventType.LOGIN;
}

export class DisconnectAction implements Action {
  readonly type = ClientEventType.DISCONNECT;
}

export class LoginFailureAction implements Action {
  readonly type = ClientEventType.LOGIN_FAILURE;
  constructor(public payload: any) { }
}

export class InGameAction implements Action  {
  readonly type = ClientEventType.INGAME;
}


export type ClientActions
  = InGameAction
  | SocketStatusAction
  | LoginAction
  | DisconnectAction
  | LoginFailureAction