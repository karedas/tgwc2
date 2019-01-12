import { Action } from '@ngrx/store';
import { UI } from 'src/app/models/client/ui.model';

export enum UIType {
  UPDATE = '[UI] Update',
}


export enum ClientEventType {
  INITIALIZE = '[Client] Socket Initialize',
  CONNECT = '[Client] Socket Connect',
  DISCONNECT = '[Client] User Disconnect',
  LOGIN = '[Client] User Login',
  LOGIN_SUCCESS = '[Client] User Login Success',
  LOGIN_FAILURE = '[Client] User Login Failure',
  INGAME = '[Client] User In Game',
  ISGOD = '[Client] User is a God',
  AUDIO = '[Client] Audio',
  UI = '[Client] Ui Updated',
  WELCOMENEWS = '[Client] Welcome News',
  TOGGLEOUTPUT = '[Client] Toggle Extra Output'
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

export class LoginSuccessAction implements Action {
  readonly type = ClientEventType.LOGIN_SUCCESS;
  constructor( public payload: boolean) {}
}

export class LoginFailureAction implements Action {
  readonly type = ClientEventType.LOGIN_FAILURE;
  constructor(public payload: any) { }
}

export class WelcomeNewsAction implements Action {
  readonly type =  ClientEventType.WELCOMENEWS;
  constructor(public payload: boolean) {}
}

export class InGameAction implements Action  {
  readonly type = ClientEventType.INGAME;
}

export class UserLevelAction implements Action {
  readonly type = ClientEventType.ISGOD;
  constructor (public payload: boolean) {}
}

export class AudioAction implements Action {
  readonly type = ClientEventType.AUDIO;
  constructor(public payload: string) {}
}

export class toggleExtraOutput implements Action {
  readonly type = ClientEventType.TOGGLEOUTPUT;
}

export class updateUI implements Action {
  readonly type = ClientEventType.UI;
  constructor(public payload: any) {}
}


// export class UpdateInventory implements Action {

// }

export type ClientActions
  = updateUI
  | InGameAction
  | SocketStatusAction
  | LoginAction
  | DisconnectAction
  | LoginSuccessAction
  | LoginFailureAction
  | AudioAction
  | UserLevelAction
  | WelcomeNewsAction
  | toggleExtraOutput
  ;
